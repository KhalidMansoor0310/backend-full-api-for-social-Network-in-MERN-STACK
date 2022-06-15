const jwt = require('jsonwebtoken');
module.exports = (req,res,next) =>{
    const authheaders = req.headers.authorization;
    const token = authheaders.split(' ')[1];
    // console.log(token)
    try {
        jwt.verify(token, 'salmankhan');
        next()
        
    } catch (error) {
        return res.status(401).json({errors:[{msg:error.message}]});
    }

}