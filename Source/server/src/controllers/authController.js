const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const register = async (req,res)=>{
   try{
    const{username,useremail,password,role} = req.body;
    hashedPassword = await bcrypt.hash(password,10);
    const newUser = new User(
        { useremail, password: hashedPassword , role}
    )
    await newUser.save()
    res.status(201)
    .json({message : `User registered with username ${useremail}`})
   }catch(err){
    res.status(500)
    .json({message : `Something went wrong`})
   }
};

const login = async (req,res)=>{
    try{
        const { useremail, password } = req.body;
    const user = await User.find({useremail});
    if(!user){
        return res.status(404)
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400)
        .json({message : `Invalied credential`})
    }
    const token = jwt.sign(
        {id: user._id, role: user.role},
        process.env.JWT_SECRET,
        {expiresIn: "1h"});
    res.status(200).json({token})
    }catch(err){
        res.status(500)
        .json({message : `Something went wrong`})
    }
};

module.exports = {
    register,
    login
};