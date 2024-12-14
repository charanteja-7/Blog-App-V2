const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();
const Post = require('../models/Post');
const Comments = require('../models/Comments');
const verifyToken = require('../verifyToken');
const multer = require('multer');
const upload = multer();
const mongoose = require('mongoose')
// Update the user
router.put('/:id', verifyToken, upload.none(), async (req, res) => {
    const { username, email, bio, profileImageUrl } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedFields = {};
        if (username) updatedFields.username = username;
        if (email) updatedFields.email = email;
        if (bio) updatedFields.bio = bio;
        if (profileImageUrl) updatedFields.profileImageUrl = profileImageUrl;

        // Handle password update
        if (req.body.password && req.body.newPassword) {
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
            const salt = await bcrypt.genSalt(10);
            updatedFields.password = await bcrypt.hash(req.body.newPassword, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: updatedFields }, { new: true });

        // Update comments if username changed
        if (updatedFields.username && updatedFields.username !== user.username) {
            await Comments.updateMany({ userId: req.params.id }, { $set: { author: updatedFields.username } });
        }

        const { password, ...safeData } = updatedUser._doc;
        return res.status(200).json(safeData);
    } catch (error) {
        console.error("Error updating user:", error.message);
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

        // Delete the user profile image if it exists and isn't the default
        const defaultImage = 'avatar.png'; // Replace with your actual default image name
        if (user.profileImageUrl && user.profileImageUrl !== defaultImage) {
            // In case you want to handle profile image deletion manually, you could manage that
            // on the server where images are hosted.
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
