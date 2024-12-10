import sequelize from '../config/database.js';

async function closeDatabase() {
  try {
    console.log('Attempting to close database connection...');
    
    // Close all database connections
    await sequelize.close();
    
    console.log('Database connection closed successfully.');
    process.exit(0); // Exit successfully
  } catch (error) {
    console.error('Error closing database connection:', error);
    process.exit(1); // Exit with error
  }
}

// Run the close function
closeDatabase();
