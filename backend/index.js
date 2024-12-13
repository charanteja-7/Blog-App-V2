require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const postRoute = require('./routes/post');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const commentsRoute = require('./routes/comments');

// Middlewares
const corsOptions = {
    origin: ['http://localhost:5173', 'https://frontend-jhj4.onrender.com'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/images', express.static(path.join(__dirname, 'images'))); // Serve images from the 'images' directory

// Routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/posts', postRoute);
app.use('/api/comments', commentsRoute);

// MongoDB connection
const mongoDB = async () => {
    try {
        await mongoose.connect(process.env.mongoURI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log("Error connecting to MongoDB");
    }
};

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
    mongoDB();
    console.log(`Server running at http://localhost:${PORT}`);
});
