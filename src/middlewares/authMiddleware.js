import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    let token;
    // req.headers['Authorization'];
    let authHeader = req.headers.authorization || req.headers.Authorization;
console.log("🥝🥝🥝🥝", req.headers);

    if (authHeader && authHeader.startsWith("Bearer")) {
        // token = authHeader.substring(7); // Remove "Bearer " from the beginning
        token = authHeader.split(" ")[1]; 

        if(!token){
            return res
            .status(401)
            .json({message: "No token provided, authorization denied"});
        }
        
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log("🍄🍄🍄🍄",decode);
            
            req.user = decode
            console.log("The Decoded user is : ", req.user);
            next();
            
        } catch (error) {
            res.status(400).json({message: "Invalid token"});
        }
    }else{
        return res
        .status(401)
        .json({message: "No token provided, authorization denied"});
    }
};