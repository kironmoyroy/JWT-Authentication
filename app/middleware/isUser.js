const jwt = require("jsonwebtoken")
const User = require("../model/user")

const isverified =async (req,res,next)=>{
    try {
        const token = req.cookies.accessToken
        if(!token){
            req.session.msg = { type: "error", message: "Session Expire" }
            res.redirect("/login")
        }else{
            const {id} = jwt.verify(token,process.env.AUTH_TOKEN)
            const user = await User.findOne({_id:id})
            if(!user){
                res.clearCookie("accessToken")
                req.session.msg = { type: "error", message: "unauthorized access" }
                res.redirect("/login")
            }else{
                next() 
            }
        }

    } catch (error) {
        res.clearCookie("accessToken")
        req.session.msg = { type: "error", message: "unauthorized access" }
        res.redirect("/login")
        // next("sad") 
    }

}



const islogin =async (req,res,next)=>{
    try {
        const token = req.cookies.accessToken
        if(!token){
            req.session.msg = { type: "error", message: "Session Expire" }
            next()
        }else{
            const {id} = jwt.verify(token,process.env.AUTH_TOKEN)
            const user = await User.findOne({_id:id})
            if(!user){
                res.clearCookie("accessToken")
                req.session.msg = { type: "error", message: "unauthorized access" }
                next()
            }else{
                res.redirect("/dashboard")
            }
        }

    } catch (error) {
        res.clearCookie("accessToken")
        req.session.msg = { type: "error", message: "unauthorized access" }
        next()
    }

}


const checkStatus =async (req,res,next)=>{
    try {
        const token = req.cookies.accessToken
        if(!token){
            res.locals.user = null
            next() 
        }else{
            const {id} = jwt.verify(token,process.env.AUTH_TOKEN)
            const user = await User.findOne({_id:id})
            if(!user){
                res.clearCookie("accessToken")
                res.locals.user = null
                next() 
            }else{
                res.locals.user = user
                next() 
            }
        }

    } catch (error) {
        res.clearCookie("accessToken")
        res.locals.user = null
        next() 
    }

}

module.exports ={isverified,islogin,checkStatus}