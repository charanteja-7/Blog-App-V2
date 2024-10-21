const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();
const Post = require('../models/Post');
const Comments = require('../models/Comments');
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

//update the user
router.put('/:id', verifyToken, upload.single('profileImageUrl'), async (req, res) => {
    try {
        const updatedData = {
            username: req.body.username,
            email: req.body.email,
            bio: req.body.bio
        };

        // Handle password update if provided
        if (req.body.password && req.body.newPassword) {
            const user = await User.findById(req.params.id);
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
            const salt = await bcrypt.genSalt(10);
            updatedData.password = await bcrypt.hash(req.body.newPassword, salt);
        }

        // Check if a new profile image is being uploaded
        const existingUser = await User.findById(req.params.id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.file) {
            // Delete old profile image if it exists and isn't the default
            const defaultImage = 'avtar.png'; // replace with your actual default image name
            if (existingUser.profileImageUrl && existingUser.profileImageUrl !== defaultImage) {
                const oldImagePath = path.join(__dirname, '../images', existingUser.profileImageUrl);
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error("Error deleting old profile image:", err);
                    }
                });
            }
            updatedData.profileImageUrl = req.file.filename;
        }

        // Update the user
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: updatedData }, { new: true });

        // If username has changed, update the author field in all comments by this user
        if (updatedData.username !== existingUser.username) {
            await Comments.updateMany(
                { userId: req.params.id },
                { $set: { author: updatedData.username } }
            );
        }

        const { password, ...userInfo } = updatedUser._doc;
        return res.status(200).json(userInfo);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Delete user
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete profile image if it exists and isn't the default
        const defaultImage = 'avatar.png'; // replace with your actual default image name
        const profileImagePath = path.join(__dirname, '../images', user.profileImageUrl);
        if (user.profileImageUrl !== defaultImage) {
            fs.unlink(profileImagePath, (err) => {
                if (err) {
                    console.error("Error deleting profile image:", err);
                }
            });
        }

        await User.findByIdAndDelete(req.params.id);
        await Post.deleteMany({ userId: req.params.id });
        await Comments.deleteMany({ userId: req.params.id });
        res.clearCookie('token');
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Get user
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { password, ...userInfo } = user._doc;
        return res.status(200).json(userInfo);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
