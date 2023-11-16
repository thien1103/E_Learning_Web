const jwt = require("jsonwebtoken");
const config = require("../config/authConfig");
const db = require("../models");
const User = db.user;

verifyToken = (req,res,next) => {
    let token = req.session.token;
    console.log(token)
    if(!token){
        return res.status(403).send({
            
            message: "No token provided!"
        });
    }

    jwt.verify(token,config.secret,(err, decoded) =>{
        if(err){
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userID = decoded.id;
        next();
    });
};

isAdmin = async(req, res , next) => {
    try{
        const user = await User.findByPk(req.userID);
        const roles = await user.getRoles();
        
        for(let i = 0;i <roles.length;i++){
            if(roles[i].name === "admin"){
                return next();
            }
        }

        return res.status(403).send({
            message: "Require Admin Role!"
        });

    }catch(error){
        return res.status(500).send({
            message: "Unable to validate User Role!"
        });
    }
};


const authJwt = {
    verifyToken,
    isAdmin
};

module.exports = authJwt;