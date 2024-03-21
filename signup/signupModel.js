const mongoose = require('mongoose')

const RegisterSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const register = mongoose.model('Register',RegisterSchema)

module.exports = register

