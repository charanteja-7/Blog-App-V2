const jwt = require('jsonwebtoken')


const verifyToken =(req, res, next)=>{
    const token = req.headers['authorization']?.split(' ')[1]; 
    if(!token){
        return res.status(401).json({message : "token not found"});
    }
    jwt.verify(token, process.env.SECRET_KEY, {}, (err, data) =>{
        if(err){
            return res.status(403).json({message : "invalid token"});
        }
        req.userId = data._id;
        next();
    })
}

module.exports = verifyToken;