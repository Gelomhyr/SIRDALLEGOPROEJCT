import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import Otp from '../models/Otp.js';

const router = express.Router();

// Middleware to verify JWT token
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, 'secrettoken');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Email Transporter Configuration
// TODO: Replace with your actual email service credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gelomhyr@gmail.com', // Replace with your email
    pass: 'fiyr gzkz wkgu nrid'      // Replace with your app password
  }
});

// @route   POST api/auth/send-otp
// @desc    Send OTP to email for registration
// @access  Public
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to DB (upsert: update if exists, insert if not)
    await Otp.findOneAndUpdate(
      { email },
      { email, otp },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    // Send Email
    await transporter.sendMail({
      from: '"BayanTrack" <no-reply@bayantrack.com>',
      to: email,
      subject: 'Your BayanTrack Registration OTP',
      text: `Your OTP code is: ${otp}. It expires in 5 minutes.`
    });

    res.json({ msg: 'OTP sent to email' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error sending email');
  }
});

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { username, firstName, middleName, lastName, address, contactNumber, email, password, otp } = req.body;

  try {
    // Verify OTP
    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    // Validate Contact Number (Must be 11 digits)
    if (!/^\d{11}$/.test(contactNumber)) {
      return res.status(400).json({ msg: 'Contact number must be exactly 11 digits' });
    }

    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ msg: 'User with this email or username already exists' });
    }

    user = new User({ username, firstName, middleName, lastName, address, contactNumber, email, password });

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    
    // Delete used OTP
    await Otp.deleteOne({ _id: validOtp._id });

    res.send('User registered successfully');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body; // identifier can be username, email or phone

  try {
    // Check for user by Username OR Email OR Contact Number
    const user = await User.findOne({ 
      $or: [{ email: identifier }, { contactNumber: identifier }, { username: identifier }] 
    });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Return Token (JWT)
    const payload = { user: { id: user.id } };
    jwt.sign(payload, 'secrettoken', { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token, role: user.role });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/auth/user
// @desc    Update user data
// @access  Private
router.put('/user', auth, async (req, res) => {
  const { firstName, middleName, lastName, address, contactNumber, email } = req.body;
  
  // Build user object
  const userFields = {};
  if (firstName) userFields.firstName = firstName;
  if (middleName) userFields.middleName = middleName;
  if (lastName) userFields.lastName = lastName;
  if (address) userFields.address = address;
  if (contactNumber) userFields.contactNumber = contactNumber;
  if (email) userFields.email = email;

  try {
    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;