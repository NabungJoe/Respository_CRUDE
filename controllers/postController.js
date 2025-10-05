import Post from '../models/postModel.js';
import User from '../models/usersModel.js';

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { title, description, userId } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }
    if (!userId) {
      return res.status(400).json({ message: 'User is required.' });
    }
    // Optionally, check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const post = await Post.create({ title, description, userId });
    // Populate user email for response
    const populated = await Post.findById(post._id).populate('userId', 'email');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all posts (with user email)
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate('userId', 'email');
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }
    const post = await Post.findByIdAndUpdate(id, { title, description }, { new: true }).populate('userId', 'email');
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    res.status(200).json({ success: true, message: 'Post deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
