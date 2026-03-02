import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import ActivityLog from '../models/ActivityLog.js';
import SystemSetting from '../models/SystemSetting.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

async function readSystemSettings() {
  const settings = await SystemSetting.findOne();
  return settings || { allowResidentRegistration: true, lockoutWindowMinutes: 15 };
}

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
    const settings = await readSystemSettings();
    if (!settings.allowResidentRegistration) {
      return res.status(403).json({ msg: 'Resident registration is temporarily disabled by system settings.' });
    }

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

// @route   POST api/auth/register/check
// @desc    Validate registration fields before sending OTP
// @access  Public
router.post('/register/check', async (req, res) => {
  const { username, email, contactNumber } = req.body;
  try {
    const settings = await readSystemSettings();
    if (!settings.allowResidentRegistration) {
      return res.status(403).json({ msg: 'Resident registration is temporarily disabled by system settings.' });
    }

    if (!username || !email || !contactNumber) {
      return res.status(400).json({ msg: 'Username, email, and phone number are required.' });
    }

    if (!/^\d{11}$/.test(contactNumber)) {
      return res.status(400).json({ msg: 'Contact number must be exactly 11 digits' });
    }

    const user = await User.findOne({ $or: [{ email }, { username }, { contactNumber }] });
    if (user) {
      if (user.email === email) return res.status(400).json({ msg: 'Email is already registered.' });
      if (user.username === username) return res.status(400).json({ msg: 'Username is already taken.' });
      if (user.contactNumber === contactNumber) return res.status(400).json({ msg: 'Phone number is already registered.' });
      return res.status(400).json({ msg: 'Account details already in use.' });
    }

    return res.json({ msg: 'Registration details are available.' });
  } catch (_err) {
    return res.status(500).json({ msg: 'Failed to validate registration details.' });
  }
});

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { username, firstName, middleName, lastName, address, contactNumber, email, password, otp, validIdType, validIdImage } = req.body;

  try {
    const settings = await readSystemSettings();
    if (!settings.allowResidentRegistration) {
      return res.status(403).json({ msg: 'Resident registration is temporarily disabled by system settings.' });
    }

    // Verify OTP
    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    // Validate Contact Number (Must be 11 digits)
    if (!/^\d{11}$/.test(contactNumber)) {
      return res.status(400).json({ msg: 'Contact number must be exactly 11 digits' });
    }

    let user = await User.findOne({ $or: [{ email }, { username }, { contactNumber }] });
    if (user) {
      if (user.email === email) {
        return res.status(400).json({ msg: 'Email is already registered.' });
      }
      if (user.username === username) {
        return res.status(400).json({ msg: 'Username is already taken.' });
      }
      if (user.contactNumber === contactNumber) {
        return res.status(400).json({ msg: 'Phone number is already registered.' });
      }
      return res.status(400).json({ msg: 'Account details already in use.' });
    }

    if (!validIdType || !validIdImage) {
      return res.status(400).json({ msg: 'Valid ID type and image are required' });
    }

    user = new User({
      username,
      firstName,
      middleName,
      lastName,
      address,
      contactNumber,
      email,
      password,
      validIdType,
      validIdImage,
      status: 'pending',
      validIdStatus: 'pending',
    });

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    
    // Delete used OTP
    await Otp.deleteOne({ _id: validOtp._id });

    res.send('Registration submitted. Awaiting superadmin approval.');
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
    const settings = await readSystemSettings();
    const lockoutMinutes = Number(settings.lockoutWindowMinutes) > 0 ? Number(settings.lockoutWindowMinutes) : 15;

    // Check for user by Username OR Email OR Contact Number
    const user = await User.findOne({ 
      $or: [{ email: identifier }, { contactNumber: identifier }, { username: identifier }] 
    });
    if (!user) {
      return res.status(404).json({ msg: 'Account is not registered yet or may have been deleted.' });
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      return res.status(423).json({
        msg: 'Too many failed login attempts. Please use Forgot Password (OTP) or try again later.',
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const attempts = (user.failedLoginAttempts || 0) + 1;
      const lockNow = attempts >= 3;
      user.failedLoginAttempts = lockNow ? 0 : attempts;
      user.lockUntil = lockNow ? new Date(Date.now() + lockoutMinutes * 60 * 1000) : null;
      await user.save();
      if (lockNow) {
        return res.status(423).json({
          msg: `Too many failed login attempts. Please use Forgot Password (OTP) or try again in ${lockoutMinutes} minutes.`,
        });
      }
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // superadmin account must always be login-capable even if status is not active
    if (user.role !== 'superadmin' && user.status !== 'active') {
      if (user.status === 'suspended') {
        return res.status(403).json({ msg: 'This account was archived by superadmin. Contact support or use Forgot Password.' });
      }
      return res.status(403).json({ msg: 'Account is pending approval by superadmin.' });
    }

    if (user.failedLoginAttempts || user.lockUntil) {
      user.failedLoginAttempts = 0;
      user.lockUntil = null;
      await user.save();
    }

    // Return Token (JWT)
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET || 'secrettoken', { expiresIn: 3600 }, (err, token) => {
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
  const { firstName, middleName, lastName, address, contactNumber, email, avatarImage } = req.body;
  
  // Build user object
  const userFields = {};
  if (firstName) userFields.firstName = firstName;
  if (middleName) userFields.middleName = middleName;
  if (lastName) userFields.lastName = lastName;
  if (address) userFields.address = address;
  if (contactNumber) userFields.contactNumber = contactNumber;
  if (email) userFields.email = email;
  if (avatarImage !== undefined) userFields.avatarImage = avatarImage;

  try {
    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (emailExists) return res.status(400).json({ msg: 'Email is already registered.' });
    }

    if (contactNumber && contactNumber !== user.contactNumber) {
      if (!/^\d{11}$/.test(contactNumber)) {
        return res.status(400).json({ msg: 'Contact number must be exactly 11 digits' });
      }
      const phoneExists = await User.findOne({ contactNumber, _id: { $ne: req.user.id } });
      if (phoneExists) return res.status(400).json({ msg: 'Phone number is already registered.' });
    }

    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { returnDocument: 'after' }
    ).select('-password');

    await ActivityLog.create({
      user: req.user.id,
      type: 'profile-update',
      title: 'Updated profile settings',
    });

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/forgot-password
// @desc    Send OTP for password reset
// @access  Public
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "No account found with this email." });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to DB
    await Otp.findOneAndUpdate(
      { email },
      { email, otp },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    // Send Email
    await transporter.sendMail({
      from: '"BayanTrack" <no-reply@bayantrack.com>',
      to: email,
      subject: 'Password Reset Request',
      text: `Your password reset code is: ${otp}. It expires in 5 minutes.`
    });

    res.json({ msg: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to send email." });
  }
});

// @route   POST api/auth/reset-password
// @desc    Reset password with OTP
// @access  Public
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Verify OTP
    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    // Delete used OTP
    await Otp.deleteOne({ _id: validOtp._id });

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
