import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);

// Database Connection
// I have inserted your username (BayanTrack) and password (BayanTrackBSIT3A)
// and added the database name 'bayantrack' so it doesn't save to 'test' by default.
const uri = "mongodb+srv://BayanTrack:BayanTrackBSIT3A@bayantrack.qc3gvju.mongodb.net/bayantrack?appName=BayanTrack";

mongoose.connect(uri)
  .then(async () => {
    console.log("MongoDB Connected Successfully");
    
    // Seed Admin and Super Admin
    try {
      const adminExists = await User.findOne({ username: 'admin123' });
      if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        await User.create({
          username: 'admin123',
          password: hashedPassword,
          role: 'admin',
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@bayantrack.com',
          contactNumber: '00000000000',
          address: 'Barangay Hall'
        });
        console.log('Admin account created');
      }

      const superAdminExists = await User.findOne({ username: 'superAdmin123' });
      if (!superAdminExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('superAdmin123', salt);
        await User.create({
          username: 'superAdmin123',
          password: hashedPassword,
          role: 'superadmin',
          firstName: 'Super',
          lastName: 'Admin',
          email: 'superadmin@bayantrack.com',
          contactNumber: '00000000001',
          address: 'City Hall'
        });
        console.log('Super Admin account created');
      }
    } catch (error) {
      console.error("Seeding error:", error);
    }
  })
  .catch(err => console.log("MongoDB Connection Error: ", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
