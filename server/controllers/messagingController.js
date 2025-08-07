import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

/** Access or create one-to-one chat */
export const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ error: 'User ID required' });

    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [req.userId, userId] },
    }).populate('users', '-password');

    if (!chat) {
      chat = await Chat.create({
        isGroupChat: false,
        users: [req.userId, userId],
      });
    }

    res.status(200).json(chat);
  } catch (err) {
    console.error('Access chat error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

/** Get all chats of a user */
export const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ users: req.userId })
      .populate('users', '-password')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'name photo' },
      })
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (err) {
    console.error('Fetch chats error:', err.message);
    res.status(500).json({ error: 'Failed to get chats' });
  }
};

/** Create group chat */
export const createGroupChat = async (req, res) => {
  try {
    const { users, chatName } = req.body;

    if (!users || users.length < 2) {
      return res.status(400).json({ error: 'Group must have 3+ users' });
    }

    const groupChat = await Chat.create({
      isGroupChat: true,
      chatName,
      users: [...users, req.userId],
      groupAdmin: req.userId,
    });

    const fullChat = await Chat.findById(groupChat._id).populate('users', '-password');

    res.status(201).json(fullChat);
  } catch (err) {
    console.error('Group chat error:', err.message);
    res.status(500).json({ error: 'Could not create group chat' });
  }
};

/** Send a message */
export const sendMessage = async (req, res) => {
  try {
    const { content, chatId, receiverId } = req.body;

    if (!chatId) return res.status(400).json({ error: 'Chat ID required' });

    const messageData = {
      sender: req.userId,
      receiver: receiverId,
      content: content || '',
      chat: chatId,
    };

    if (req.file) {
      messageData.file = req.file.path;
    }

    const message = await Message.create(messageData);

    // Update chat's last message
    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

    res.status(201).json(message);
  } catch (err) {
    console.error('Send message error:', err.message);
    res.status(500).json({ error: 'Message send failed' });
  }
};

/** Get chat history */
export const getChatHistory = async (req, res) => {
  try {
    const chatId = req.params.chatId;

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name photo')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error('Chat history error:', err.message);
    res.status(500).json({ error: 'Failed to load messages' });
  }
};