const Message = require('../models/Message');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content, image, messageType } = req.body;

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content: content || '',
      image: image || null,
      messageType: messageType || 'text'
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username avatar')
      .populate('receiver', 'username avatar');

    // Emit socket event
    if (req.io) {
      req.io.to(receiverId).emit('newMessage', populatedMessage);
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    })
      .populate('sender', 'username avatar lastSeen isOnline')
      .populate('receiver', 'username avatar lastSeen isOnline')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id },
            { receiver: req.user._id }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', req.user._id] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' }
        }
      }
    ]);

    const conversations = await User.populate(messages, {
      path: '_id lastMessage.sender lastMessage.receiver',
      select: 'username email avatar'
    });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    await Message.updateMany(
      { sender: userId, receiver: req.user._id, read: false },
      { read: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      read: false
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};