const jwt=require("jsonwebtoken")
const { jwt_secret } = require("../config")
const { User } = require("../db")

function check(req,res,next){
    const { username, password } = req.body;
    User.findOne({
        username: username,
        password: password
    })
        .then(function (response) {
            if (response) {
                res.status(403).json({
                    msg: "User already exist"
                })
            }
            else {
                next()
            }
        })
}


function Middleware(req, res, next) {
    const token=req.headers.authorization
    const arr=token.split(" ")      
    const jwtToken=arr[1] 
    const value=jwt.verify(jwtToken,jwt_secret)
    if(value.username){         
        next()
    }
    else{
        res.status(403).json({
            msg:"You are not authenticated"
        })
    }
}

module.exports = {Middleware,check};