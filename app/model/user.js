const { Schema, model, default: mongoose } = require("mongoose");


const userSchame = new Schema({
    name:{type:String,require:true},
    email:{type:String,require:true},
    password:{type:String,require:true}
})

module.exports = mongoose.model("User", userSchame)