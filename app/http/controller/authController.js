const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")

const User = require('../../model/user');



const authController = () =>{
    return{
        singup(req,res){
            res.render("auth/singup")
        },
        async postsingup(req,res){
           const {name, email, password, cpassword} = req.body;
           if(!name, !email, !password, !cpassword){
            req.session.msg = { type: "error", message: "All fields are required" }
            req.flash("name", name)
            req.flash("email", email)
            res.redirect("/singup")
           }else{
            if(password != cpassword){
                req.session.msg = { type: "error", message: "Confromed password are not match" }
                req.flash("name", name)
                req.flash("email", email)
                res.redirect("/singup")
            }else{
                const hashPasswoed = await bcrypt.hash(password,10)
                const user = await new User({
                    name,email,password:hashPasswoed
                });
                user.save().then(data=>{
                    const token = createToken(data._id)
                    res.cookie("accessToken",token,{httpOnly:true,maxAge:24*60*60*1000});
                    req.session.msg = { type: "done", message: "Your Account create successfully" }
                    res.redirect("/dashboard")
                }).catch(err=>{
                    console.log(err);
                    req.session.msg = { type: "error", message: "Somethink want Wrong" }
                    req.flash("name", name)
                    req.flash("email", email)
                    res.redirect("/singup")
                })

            }

           }

        },
        login(req,res){
            res.render("auth/login")
        },
        async postLogin(req,res){
            const {email, password} = req.body;
            if(!email, !password){
                req.session.msg = { type: "error", message: "All fields are required" }
                req.flash("email", email)
                res.redirect("/login")
            }else{
                const user = await User.findOne({"email":email})
                if(user){
                    const matchPassword = await bcrypt.compare(password,user.password)
                    if (matchPassword) {
                        const token = createToken(user._id)
                        res.cookie("accessToken",token,{httpOnly:true,maxAge:24*60*60*1000});
                        req.session.msg = { type: "done", message: "Your Account login successfully" }
                        res.redirect("/dashboard")
                    }else{
                        req.session.msg = { type: "error", message: "Worng Email or Password" }
                        req.flash("email", email)
                        res.redirect("/login")
                    }
                }else{
                    req.session.msg = { type: "error", message: "User not found" }
                    req.flash("email", email)
                    res.redirect("/login")
                }
            }
        },
        logout(req,res){
            res.clearCookie("accessToken")
            res.redirect("/")
        },
    }
}

module.exports = authController;





const createToken = (id)=>{
    return jwt.sign({id},process.env.AUTH_TOKEN,{
        expiresIn:24*60*60
    })
}
    