import sequelize from '../config/database.js';
import Profile from '../models/Profile.js';

async function testDatabase() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection successful');

    // Create a test profile
    const testProfile = await Profile.create({
      name: 'Test User',
      email: 'test@example.com',
      bio: 'This is a test profile',
      avatarUrl: 'https://example.com/avatar.jpg'
    });
    console.log('✓ Created test profile:', testProfile.toJSON());

    // Read the profile
    const retrievedProfile = await Profile.findByPk(testProfile.id);
    console.log('✓ Retrieved profile:', retrievedProfile.toJSON());

    // Update the profile
    await retrievedProfile.update({ bio: 'Updated bio' });
    console.log('✓ Updated profile bio');

    // List all profiles
    const allProfiles = await Profile.findAll();
    console.log('✓ All profiles in database:', allProfiles.map(p => p.toJSON()));

    // Delete the test profile
    await testProfile.destroy();
    console.log('✓ Deleted test profile');

    console.log('\nAll database operations completed successfully!');
  } catch (error) {
    console.error('Database test failed:', error);
  } finally {
    await sequelize.close();
  }
}

testDatabase();
