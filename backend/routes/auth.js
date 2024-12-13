const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const router = express.Router();



//register
router.post('/register', async(req,res) =>{
    try {
        const {username , email, password} = req.body;

        
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({ message: "Email already in use" });
        }

        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            username,
            email,
            password : hashedPassword
        });
        const savedUser = await newUser.save();
        return res.status(201).json(savedUser);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})

//login
router.post('/login', async(req,res)=>{

    try {
        const user = await User.findOne({email : req.body.email});
        if(!user){
            return res.status(404).json({message : "User not found"});
        }
        const match = await bcrypt.compare(req.body.password, user.password);
        if(!match){
            return res.status(400).json({message : "Incorrect Password"});
        }
        const { _id, username, email, profileImageUrl, bio } = user;
        const token = jwt.sign(
            {_id , username , email , profileImageUrl ,bio },
            process.env.SECRET_KEY,
             {expiresIn:"1d"}
            );
        
        const {password, ...userinfo} = user.toObject();
        return res.status(200).json({ userinfo, token });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }

})


//logout
router.get('/logout', async(req, res) => {
    try {   
        return res.status(200).json("logout successfull");
    } catch (error) {
        return res.status(404).json("unable to logout")
    }
})

//refetch
router.get('/refetch', async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1]; 
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        jwt.verify(token, process.env.SECRET_KEY, {}, (err, data) => {
            if (err) {
                return res.status(401).json({ message: "Token is invalid or expired" });
            }
            return res.status(200).json(data);
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;