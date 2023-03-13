require('dotenv').config()
const express = require('express');
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require('express-flash');

// Middleware
const {checkStatus} = require("./app/middleware/isUser")

const app = express()
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const connection = mongoose.connection
connection.once("open",()=>{
    console.log("Database Connected ...");
}).on("err",()=>{
    console.error("Connection Faild ..");
})


// session config
app.use(session({
    secret: "waxneHairAndBeautySECRETcookie",
    secure: true,
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge:5000},
}));

app.use((req,res,next)=>{
    res.locals.session = req.session
    res.locals.msg = req.session.msg
    delete req.session.msg 
    next()
})

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(express.static(path.join(__dirname,"Public")))
app.set("views", path.join(__dirname,"Views"))
app.set("view engine", "ejs")
app.use(flash());
app.use(cookieParser());

app.get("*",checkStatus)
app.post("*",checkStatus)
require("./routes/web")(app)






const PORT = 3001 || process.env.PORT
app.listen(PORT,()=>{
    console.warn(`Server is raning PORT ${PORT}`);
})