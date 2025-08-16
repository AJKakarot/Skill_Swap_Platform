// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },

    skills: {
      type: [String],
      required: true,
      validate: [arr => arr.length > 0, 'At least one skill is required'],
    },

    bio: {
      type: String,
      maxlength: 300,
      default: '',
      trim: true,
    },

    photo: {
      type: String,
      default: '', // e.g., "uploads/default.jpg" or a cloud URL
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
    
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
