const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comments = require('../models/Comments');
const verifyToken = require('../verifyToken');
const multer = require('multer');
const upload = multer();

router.post('/', verifyToken, upload.none(), async (req, res) => {
  try {
    const { title, description, coverImageURL, userId, category } = req.body;

    // Validation checks
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }
    if (!coverImageURL) {
      return res.status(400).json({ error: "Cover Image URL is required" });
    }
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const newPost = new Post({
      title,
      description,
      coverImageURL,
      userId,
      category: category || "Technology",
    });

    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (error) {
    console.error("Detailed Error:", error);
    return res.status(500).json({ 
      error: "Internal Server Error", 
      details: error.message 
    });
  }
});

// Update post
router.put('/:id', verifyToken, upload.none(), async (req, res) => {
    try {
        // Retrieve the existing post by ID
        const existingPost = await Post.findById(req.params.id);
        if (!existingPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Destructure the request body
        const { title, description, coverImageURL, userId, category } = req.body;
        
        // Validation checks (similar to POST route)
        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }
        if (!description) {
            return res.status(400).json({ error: "Description is required" });
        }
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Prepare update data
        const updateData = {
            title,
            description,
            category: category || "Technology",
            userId,
        };

        // If coverImageURL is provided, update it
        if (coverImageURL) {
            updateData.coverImageURL = coverImageURL;
        }

        // Update the post with the new data
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, 
            { $set: updateData }, { new: true });

        return res.status(200).json(updatedPost);
    } catch (error) {
        // Detailed error logging
        console.error("Detailed Error:", error);
        return res.status(500).json({
            error: "Internal Server Error",
            details: error.message
        });
    }
});


// Delete post
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        await Post.findByIdAndDelete(req.params.id);
        await Comments.deleteMany({ postId: req.params.id });
        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Get post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('userId', 'username email profileImageUrl');
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ createdAt: -1 }).populate('userId', 'username email profileImageUrl');
        if (posts.length === 0) {
            return res.status(404).json({ message: "No posts found" });
        }
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Get user posts
router.get('/user/:userId', async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.userId });
        if (posts.length === 0) {
            return res.status(404).json({ message: "No posts found for this user" });
        }
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Like and unlike post
router.put('/:id/like', async (req, res) => {
    const postId = req.params.id;
    const { userId } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (post.likes.includes(userId)) {
            post.likes = post.likes.filter(id => id.toString() !== userId);
        } else {
            post.likes.push(userId);
        }
        const updatedPost = await post.save();
        return res.status(200).json({ success: true, likes: updatedPost.likes });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Increment post views
router.post('/:id/view', async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { 
                new: true,  
                runValidators: true 
            }
        );

        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        return res.status(200).json({
            success: true,
            views: updatedPost.views
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error while updating views'
        });
    }
});

// Get views
router.get('/:id/views', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        return res.status(200).json({
            success: true,
            views: post.views || 0,
            postId: post._id
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error while retrieving the views'
        });
    }
});

module.exports = router;
