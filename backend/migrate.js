require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const Message = require('./models/Message');
const Notification = require('./models/Notification');

const LOCAL_URI = 'mongodb://localhost:27017/smart-info-platform';
const ATLAS_URI = process.env.MONGODB_URI;

const migrate = async () => {
  try {
    // Connect to local
    const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('✅ Connected to Local MongoDB');

    const LocalUser = localConn.model('User', User.schema);
    const LocalPost = localConn.model('Post', Post.schema);
    const LocalMessage = localConn.model('Message', Message.schema);
    const LocalNotification = localConn.model('Notification', Notification.schema);

    // Connect to Atlas
    const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log('✅ Connected to MongoDB Atlas');

    const AtlasUser = atlasConn.model('User', User.schema);
    const AtlasPost = atlasConn.model('Post', Post.schema);
    const AtlasMessage = atlasConn.model('Message', Message.schema);
    const AtlasNotification = atlasConn.model('Notification', Notification.schema);

    // Migrate Users
    const users = await LocalUser.find().lean();
    if (users.length > 0) {
      await AtlasUser.deleteMany();
      await AtlasUser.insertMany(users, { ordered: false });
      console.log(`✅ Migrated ${users.length} users`);
    }

    // Migrate Posts
    const posts = await LocalPost.find().lean();
    if (posts.length > 0) {
      await AtlasPost.deleteMany();
      await AtlasPost.insertMany(posts, { ordered: false });
      console.log(`✅ Migrated ${posts.length} posts`);
    }

    // Migrate Messages
    const messages = await LocalMessage.find().lean();
    if (messages.length > 0) {
      await AtlasMessage.deleteMany();
      await AtlasMessage.insertMany(messages, { ordered: false });
      console.log(`✅ Migrated ${messages.length} messages`);
    }

    // Migrate Notifications
    const notifications = await LocalNotification.find().lean();
    if (notifications.length > 0) {
      await AtlasNotification.deleteMany();
      await AtlasNotification.insertMany(notifications, { ordered: false });
      console.log(`✅ Migrated ${notifications.length} notifications`);
    }

    console.log('\n🎉 Migration completed successfully!');
    await localConn.close();
    await atlasConn.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
};

migrate();
