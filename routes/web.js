const authController = require("../app/http/controller/authController")
const indexControler = require("../app/http/controller/indexController")


const {isverified,islogin} = require("../app/middleware/isUser")


const  initWeb = (app)=>{

    app.get("/",indexControler().home)


    // Auth Controller Fun 

    app.get("/singup",islogin,authController().singup)
    app.post("/singup",islogin,authController().postsingup)
    app.get("/login",islogin,authController().login)
    app.post("/login",islogin,authController().postLogin)
    app.get("/logout",isverified,authController().logout)


    app.get("/dashboard",isverified,(req,res)=>{
        res.render("user/dashboard")
    })
    

}

module.exports = initWeb