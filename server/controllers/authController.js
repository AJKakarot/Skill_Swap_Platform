import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ✅ Register a new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, skills } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      skills,
    });

    res.status(201).json({
      message: 'User registered successfully',
      userId: newUser._id,
    });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// ✅ User login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id , email: user.email, name: user.name ,skills: user.skills, photo: user.photo },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        skills: user.skills,
        photo: user.photo,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Login failed' });
  }
};

// ✅ Upload profile photo
// controllers/userController.js

export const uploadProfilePhoto = async (req, res) => {
    try {
      if (!req.file || !req.file.path) {
        return res.status(400).json({ error: 'No photo uploaded' });
      }
  
      // Normalize path (for Windows, replace \ with /)
      const normalizedPath = req.file.path.replace(/\\/g, '/');
  
      // Optional: validate file type here (e.g., only images) if needed
      // if (!req.file.mimetype.startsWith('image/')) {
      //   return res.status(400).json({ error: 'Only image files are allowed' });
      // }
  
      const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        { photo: normalizedPath },
        { new: true, runValidators: true }
      ).select('_id name email skills photo createdAt updatedAt');
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({
        message: 'Photo uploaded successfully',
        user: updatedUser,
      });
  
    } catch (err) {
      console.error('Photo upload error:', err.message);
      res.status(500).json({ error: 'Upload failed. Try again later.' });
    }
  };
  
  

// ✅ Get current authenticated user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Get current user error:', err.message);
    res.status(500).json({ error: 'Could not fetch user' });
  }
};


// GET all users except the currently logged-in user
export const getAllUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user.id; // from auth middleware
    const users = await User.find({ _id: { $ne: loggedInUserId } })
      .select("name email skills"); // only return needed fields

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const logoutUser = async (req, res) => { 
  try {
    // Clear the token from the client side (handled in client code)
    // Here we just send a success response
    // If you want to invalidate the token server-side, you could implement a token blacklist or similar mechanism

    // For now, we just return a success message
   return res.status(200).json({ message: 'User logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err.message);
    res.status(500).json({ error: 'Logout failed' });
  }
}