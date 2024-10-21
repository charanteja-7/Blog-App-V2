const express = require('express')
const router = express.Router();
const Post = require('../models/Post');
const Comments = require('../models/Comments')
const verifyToken = require('../verifyToken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

// Create post
router.post('/', verifyToken, upload.single('coverImage'), async (req, res) => {
    try {
        const newPost = new Post({
            title: req.body.title,
            description: req.body.description,
            coverImageURL: req.file ? req.file.filename : 'image.png',
            userId: req.body.userId,
            category: req.body.category || "Technology",
        });
        const savedPost = await newPost.save();
        return res.status(200).json(savedPost);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});





// Update post
router.put('/:id', verifyToken, upload.single('coverImage'), async (req, res) => {
    try {
        const existingPost = await Post.findById(req.params.id);
        if (!existingPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        const updateData = {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            userId: req.body.userId,
        };
        if (req.file) {
            if (existingPost.coverImageURL !== 'image.png') {
                const oldImagePath = path.join(__dirname, '../images', existingPost.coverImageURL);
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error("Error deleting old image:", err);
                    }
                });
            }
            updateData.coverImageURL = req.file.filename;
        }
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, 
                                { $set: updateData }, { new: true });
        return res.status(200).json(updatedPost);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


//delete post
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const defaultImage = 'image.png'; 
        const coverImagePath = path.join(__dirname, '../images', post.coverImageURL);
        if (post.coverImageURL !== defaultImage) {
            fs.unlink(coverImagePath, (err) => {
                if (err) {
                    console.error("Error deleting image:", err);
                }
            });
        }
        await Post.findByIdAndDelete(req.params.id);
        await Comments.deleteMany({ postId: req.params.id });
        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


//get the post by id
router.get('/:id', async(req, res)=>{
    try {
        const post = await Post.findById(req.params.id).populate('userId', 'username email profileImageUrl');
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})


//get all posts
router.get('/',  async(req, res)=>{
    try {
        const posts = await Post.find({}).sort({createdAt : -1}).populate('userId', 'username email profileImageUrl');
        if (posts.length === 0) {
            return res.status(404).json({ message: "No posts found" });
        }
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})

//get user posts
router.get('/user/:userId',  async(req, res)=>{
    try {
        const posts = await Post.find({userId : req.params.userId});
        if (posts.length === 0) {
            return res.status(404).json({ message: "No posts found for this user" });
        }
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})


//like and unlike
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

// get views
router.get('/:id/views', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        // Check if post exists
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Return the views count
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