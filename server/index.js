import express from 'express';
import cors from 'cors';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import sequelize from './config/database.js';
import Profile from './models/Profile.js';
import User from './models/User.js';
import { authController } from './controllers/authController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

// Set up file upload
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database sync and initial admin creation
sequelize.sync()
  .then(async () => {
    console.log('Database synced');
    await authController.createInitialAdmin();
  })
  .catch(err => console.error('Error syncing database:', err));

// Authentication routes
app.post('/api/auth/login', [
  body('username').notEmpty(),
  body('password').notEmpty()
], authController.login);

app.get('/api/auth/validate', authController.validateToken);

// Create profile with file upload
app.post('/api/profiles', upload.single('picture'), [
  body('fullName').notEmpty().trim(),
  body('studentNumber').notEmpty().trim(),
  body('degreeProgram').notEmpty().trim(),
  body('package').notEmpty().trim(),
  body('paymentStatus').optional(),
  body('partialAmount').optional().isNumeric(),
  body('paymentDate').optional(),
  body('isClaimed').optional().isBoolean(),
  body('claimDate').optional(),
  body('claimedBy').optional(),
  body('facebookAccount').optional(),
  body('email').optional().isEmail()
], async (req, res) => {
  try {
    console.log('Received profile creation request:', {
      body: req.body,
      file: req.file
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const pictureUrl = req.file ? 
      `http://localhost:${port}/uploads/${req.file.filename}` : 
      '/placeholder.svg';

    const profile = await Profile.create({
      ...req.body,
      pictureUrl
    });

    res.status(201).json(profile);
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all profiles
app.get('/api/profiles', async (req, res) => {
  try {
    const profiles = await Profile.findAll();
    res.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get profile by ID
app.get('/api/profiles/:id', async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.params.id);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update profile
app.put('/api/profiles/:id', upload.single('picture'), [
  body('fullName').optional().notEmpty().trim(),
  body('studentNumber').optional().notEmpty().trim(),
  body('degreeProgram').optional().notEmpty().trim(),
  body('package').optional().notEmpty().trim(),
  body('paymentStatus').optional(),
  body('partialAmount').optional().isNumeric().toFloat(),
  body('paymentDate').optional(),
  body('isClaimed').optional().isBoolean().toBoolean(),
  body('claimDate').optional(),
  body('claimedBy').optional(),
  body('facebookAccount').optional(),
  body('email').optional().isEmail()
], async (req, res) => {
  try {
    console.log('Update request received for ID:', req.params.id);
    console.log('Request body:', req.body);
    console.log('File:', req.file);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    let profile = await Profile.findByPk(req.params.id);
    if (!profile) {
      console.error('Profile not found:', req.params.id);
      return res.status(404).json({ error: 'Profile not found' });
    }

    console.log('Found existing profile:', profile.toJSON());

    // Prepare update data
    const updateData = {};
    
    // Only include fields that are actually present in the request
    if (req.body.fullName) updateData.fullName = req.body.fullName;
    if (req.body.studentNumber) updateData.studentNumber = req.body.studentNumber;
    if (req.body.degreeProgram) updateData.degreeProgram = req.body.degreeProgram;
    if (req.body.package) updateData.package = req.body.package;
    if (req.body.paymentStatus) {
      updateData.paymentStatus = req.body.paymentStatus;
      updateData.hasPaid = req.body.paymentStatus === 'full';
    }
    if (req.body.partialAmount) updateData.partialAmount = parseFloat(req.body.partialAmount);
    if (req.body.paymentDate) updateData.paymentDate = req.body.paymentDate;

    // Handle claim status
    if (req.body.isClaimed !== undefined) {
      const isClaimed = Boolean(req.body.isClaimed);
      updateData.isClaimed = isClaimed;
      
      if (!isClaimed) {
        // When unclaiming, set claim fields to null
        updateData.claimDate = null;
        updateData.claimedBy = null;
      } else {
        // When claiming, update claim date and claimed by
        updateData.claimDate = req.body.claimDate || new Date().toISOString();
        updateData.claimedBy = req.body.claimedBy || '';
      }
    }

    if (req.body.facebookAccount) updateData.facebookAccount = req.body.facebookAccount;
    if (req.body.email) updateData.email = req.body.email;

    // Handle file upload
    if (req.file) {
      updateData.pictureUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
      
      // Delete old picture if it exists and it's not the placeholder
      if (profile.pictureUrl && !profile.pictureUrl.endsWith('placeholder.svg')) {
        const oldFileName = profile.pictureUrl.split('/').pop();
        const oldFilePath = path.join(uploadsDir, oldFileName);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    console.log('Updating profile with data:', updateData);

    try {
      // Update the profile
      await profile.update(updateData);
      
      // Force a refresh from the database
      profile = await Profile.findByPk(req.params.id);
      
      console.log('Profile after update:', profile.toJSON());
      res.json(profile.toJSON());
    } catch (updateError) {
      console.error('Error during update operation:', updateError);
      throw updateError;
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Bulk delete profiles
app.delete('/api/profiles/bulk', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'Invalid request: ids must be an array' });
    }

    for (const id of ids) {
      const profile = await Profile.findByPk(id);
      if (profile) {
        // Delete profile picture if it exists
        if (profile.pictureUrl) {
          const fileName = profile.pictureUrl.split('/').pop();
          const filePath = path.join(uploadsDir, fileName);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        await profile.destroy();
      }
    }

    res.status(200).json({ message: 'Profiles deleted successfully' });
  } catch (error) {
    console.error('Error deleting profiles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete profile
app.delete('/api/profiles/:id', async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.params.id);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Delete profile picture if it exists
    if (profile.pictureUrl) {
      const fileName = profile.pictureUrl.split('/').pop();
      const filePath = path.join(uploadsDir, fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await profile.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
