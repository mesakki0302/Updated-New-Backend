const asyncHandler = require('express-async-handler');
const User = require('../signup/signupModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Login = asyncHandler(async(req,res)=>{
    const{email,password} = req.body

    if(!email||!password){
        res.status(400)
        throw new Error("All Fields Mandatory")
    }

    const user = await User.findOne({email})

    if(user && (await bcrypt.compare(password,user.password)))
    {
       const acesstoken = jwt.sign({
        user:{
            username:user.username,
            email:user.email,
            id:user.id
        }
       },process.env.ACCESS_TOKEN,{expiresIn:"15m"})
       res.status(200).json({message:"Login Sucessfully",acesstoken})
    }
    else{
        res.status(404)
        throw new Error("email or password is not valid")
    }
})


module.exports = {Login}