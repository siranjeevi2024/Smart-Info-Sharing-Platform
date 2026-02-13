require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB Connected');
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Post.deleteMany();

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create regular users
    const user1 = await User.create({
      username: 'john_doe',
      email: 'john@example.com',
      password: 'password123'
    });

    const user2 = await User.create({
      username: 'jane_smith',
      email: 'jane@example.com',
      password: 'password123'
    });

    // Create sample posts
    await Post.create([
      {
        title: 'Introduction to React Hooks',
        description: 'Learn about useState, useEffect, and custom hooks in React. This comprehensive guide covers everything you need to know about modern React development.',
        category: 'Technology',
        tags: ['react', 'javascript', 'hooks'],
        createdBy: user1._id
      },
      {
        title: 'The Future of AI in Healthcare',
        description: 'Exploring how artificial intelligence is revolutionizing medical diagnosis and treatment. AI is transforming healthcare delivery and patient outcomes.',
        category: 'Health',
        tags: ['ai', 'healthcare', 'technology'],
        createdBy: user2._id
      },
      {
        title: 'Startup Funding Strategies',
        description: 'A complete guide to raising capital for your startup. Learn about seed funding, venture capital, and angel investors.',
        category: 'Business',
        tags: ['startup', 'funding', 'entrepreneurship'],
        createdBy: admin._id
      },
      {
        title: 'Climate Change Solutions',
        description: 'Innovative approaches to combat global warming and reduce carbon emissions. Discover sustainable practices for a better future.',
        category: 'Science',
        tags: ['climate', 'environment', 'sustainability'],
        createdBy: user1._id
      },
      {
        title: 'Online Learning Best Practices',
        description: 'Tips and strategies for effective remote education. Maximize your learning potential with these proven techniques.',
        category: 'Education',
        tags: ['education', 'online', 'learning'],
        createdBy: user2._id
      }
    ]);

    console.log('✅ Data seeded successfully!');
    console.log('Admin credentials: admin@example.com / admin123');
    console.log('User credentials: john@example.com / password123');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();