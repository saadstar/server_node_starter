const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createJWT = require("../config/createJWT");


// register
const register = asyncHandler(async (req, res) => {
  try {
      const { username, email, password, isAdmin } = req.body;

    //    check if the user exist 
       const userExist = await User.findOne({ email });
       if (userExist) {
         return res.status(400).json({
           status: false,
           message: "User already registered!"
         });
       }

    // hashing Password Bcrypt
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword =await bcrypt.hashSync(password, salt);
    // creating new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin,
    });
      
    const savedUser = await newUser.save();
    const {password:_, ...savedUserData}=savedUser._doc
    res.status(201).json(savedUserData);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false, message: err.message });
  }
});

//login
const login = asyncHandler(async (req, res) => {
  try {
      const { email, password } = req.body;
      
      // check if email exist or not
     const user = await User.findOne({ email });
      if (!user) {         
       return res
         .status(401)
         .json({ status: false, message: "email is not exist!" });
      }   
      
    // comparing Password Bcrypt
    const isCorrect = await bcrypt.compareSync(password, user.password);
    if (!isCorrect) {
     res.status(401).json("wrong password!")
    }
    
     if (user) {
       createJWT(res, user._id);
       user.password = undefined;
       res.status(200).json(user);
     } else {
       return res.status(401).json({
         status: false,
         message:"wrong with email or password!",
       });
     }
  } catch (error) {
 console.log(error);
 return res.status(400).json({ status: false, message: error.message });
  }
});

// get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const oneUsers = await User.find();
    res.status(200).json(oneUsers);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
});

// delete user by id
const deleteUser = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User have been Deleted Successfuly.");
  } catch (err) {
    res.status(505).json(err);
  }
});

// auth with google
const authWithGoogle = async (req, res) => {
  try {
    const { email, name, picture } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    let user = await User.findOne({ email });

    if (user) {
      createJWT(res, user._id);
      user.password = undefined; // Exclude sensitive information
      return res.status(200).json({ user });
    }

    // If the user doesn't exist, create a new one
    const newUser = new User({
      email,
      name,
      picture,
    });

    const savedUser = await newUser.save();
    createJWT(res, savedUser._id);
    savedUser.password = undefined;
    return res.status(201).json({ user: savedUser });
  } catch (error) {
    console.error("Error during Google authentication:", error);
    res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
};
    
module.exports = { register, login, getAllUsers, deleteUser, authWithGoogle };
