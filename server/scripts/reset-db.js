import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from '../config/database.js';
import Profile from '../models/Profile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Sample data
const sampleProfiles = [
  {
    fullName: "John Doe",
    studentNumber: "2024-0001",
    degreeProgram: "BS Computer Science",
    pictureUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    package: "Basic Package",
    hasPaid: true,
    claimDate: new Date("2024-03-15"),
    claimedBy: "Staff Member 1",
    facebookAccount: "john.doe.cs",
    email: "john.doe@example.com"
  },
  {
    fullName: "Jane Smith",
    studentNumber: "2024-0002",
    degreeProgram: "BS Information Technology",
    pictureUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    package: "Premium Package",
    hasPaid: false,
    facebookAccount: "jane.smith.it",
    email: "jane.smith@example.com"
  }
];

// Initialize database
async function resetDb() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Force sync to drop existing tables
    await sequelize.sync({ force: true });
    console.log('Database tables dropped and recreated.');

    // Add sample data
    await Profile.bulkCreate(sampleProfiles);
    console.log('Sample profiles added successfully.');

  } catch (error) {
    console.error('Unable to initialize database:', error);
  } finally {
    await sequelize.close();
  }
}

resetDb();
