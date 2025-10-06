import { signupSchema, signinSchema, acceptCodeSchema } from "../middlewares/validator.js";
import { doHash, doHashValidation, hmacProcess } from "../utils/hashing.js";
import jwt from "jsonwebtoken";
import transporter from "../middlewares/sendMail.js";


//Model
import Admin from "../models/adminModel.js";
import User from "../models/usersModel.js";
import Post from '../models/postModel.js';

//Sign up
export const signup = async (req, res) => {
  const { email, password } = req.body;
    try{
           const {error,value}  = signupSchema.validate({email,password});
           
           if(error){
            return res.status(401).json({success:false, message: error.details[0].message}); 
           }           
         const existingUser = await User.findOne({email});
              
         if(existingUser){
            return res.status(401).json({success:false, message: "User already exists"});
         }
         const hashedPassword = await doHash(password, 12);
      
         const newUser = new User({
            email,
            password: hashedPassword,
         })

         const result = await newUser.save();
         console.log(hashedPassword, password)
         result.password = undefined;
         res.status(201).json({success:true, data: result, message: "User created successfully"}); 
         
    }
    catch(error){
        return res.status(500).json({ error: error.message });
    }

 };

//Sign in
 export const signin = async (req, res) => {
    const {email, password} = req.body;
    try {
      const {error, value} = signinSchema.validate({email, password});
      
      if(error){
        return res.status(401).
        json({success:false, message: error.details[0].message});
      }

      const existingUser = await User.findOne({email}).select("+password");
      if(!existingUser){
        return res.status(401).json({success:false, message: "User does not exist"});
      }
      if (!existingUser.verified) {
        return res.status(401).json({success:false, message: "Please verify your email before signing in."});
      }
      const result = await doHashValidation(password, existingUser.password);
      if(!result){
        return res.status(401).json({success:false, message: "Invalid password"});
      }
      const token = jwt.sign({
        email: existingUser.email,
        id: existingUser._id, 
        verified: existingUser.verified
      },process.env.TOKEN_SECRET, {
        expiresIn: "8h"
      });
      res.cookie(
        'Authorization', 'Bearer ' + token,
        {
          expires: new Date(Date.now() + 8 * 3600000),
          httpOnly: false, // allow JS access for dev
          secure: false,   // allow non-https for dev
          sameSite: 'lax',
          path: '/',
        }
      );
      existingUser.password = undefined;
      res.status(200).json({success:true, data: existingUser, token: token, message: "User logged in successfully"});
   } catch (error) {
     return res.status(500).json({ error: error.message });
   }
 }

 //Sign out
export const signout = async (req, res) => {
  res.clearCookie('Authorization');
  res.json({success:true, message: "User logged out successfully"});


}; 


  
//Send verification email
 export const sendVerificationEmail = async (req, res) => {
 const {email} = req.body;
 try{
  const existingUser = await User.findOne({email});

  if(!existingUser){
    return res
      .status(404)
      .json({success:false, message: "User does not exist"});
  }
  if(existingUser.verified){
    return res
    .status(400)
    .json({success:false, message: "User already verified"});
  }
  const codeValue = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  console.log('Verification code for', email, 'is:', codeValue);

 let info = await transporter.sendMail({
    from:process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
    to : existingUser.email,
    subject: "Email Verification",
    html: `<h1> Your verification code is ${codeValue}</h1>`
    
 })

 
 if(info.accepted[0] === existingUser.email){
 const hashedCode = await hmacProcess(codeValue, process.env.HMACHASH_SECRET);
 existingUser.verificationCode = hashedCode;
 existingUser.verificationCodeValidation = Date.now();
 await existingUser.save();
 console.log(existingUser.id);
 console.log("Hashed Coode: " + hashedCode);
 return res.status(200).json({
    success:true, 
    message: "Verification code sent successfully"
  });
 }
 res.status(400).json({success:false, message: "Error sending email"});

 }catch(error){
    return res.status(500).json({ error: error.message });
 }
};


//Verify code
export const verifyCode = async (req, res) => {
  const { email, providedCode } = req.body;
 try{
  const {error, value} = acceptCodeSchema.validate({email, providedCode});
      

  if(error){
    return res.status(401).
    json({success:false, message: error.details[0].message});

  }
  const codeValue = providedCode.toString();
  const existingUser = await User.findOne({email})
  .select("+verificationCode +verificationCodeValidation");

  if(!existingUser){
    return res
    .status(404)
    .json({success:false, message: "User does not exist"});
  }
  if(existingUser.verified){
    return res
    .status(400)
    .json({success:false, message: "User already verified"});
  }

  if(!existingUser.verificationCode || !existingUser.verificationCodeValidation){
    return res
    .status(400)
    .json({success:false, message: "No verification code found"});
  }

  if(Date.now() - existingUser.verificationCodeValidation > 5* 60 *1000){
  return res.status(400).json({success:false, message:'Code has been expired!'})
  }



  const hashedCode = hmacProcess(codeValue,process.env.HMACHASH_SECRET);

  if(hashedCode === existingUser.verificationCode){
    existingUser.verified = true;
    existingUser.verificationCode = undefined;
    existingUser.verificationCodeValidation = undefined;
    await existingUser.save();
    return res.status(200).json({success:true, message:'Your account has been verified'});

  }
  return res.status(400).json({success:false, message:'Unexpected error occured!'})

 }catch(error){
     console.log(error);
     res.status(500).json({
      success:false,
      message: "Server has an Error",})
 }
}


export const getSignedInUser = async (req, res) => {
  try {
    // Try to get token from cookie or header
    let token;
    if (req.cookies && req.cookies.Authorization && req.cookies.Authorization.startsWith('Bearer ')) {
      token = req.cookies.Authorization.replace('Bearer ', '');
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.replace('Bearer ', '');
    }
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.password = undefined;
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching signed-in user:', error);
    res.status(500).json({ success: false, message: 'Server has an Error', error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id, email } = req.params;
    const user = await User.findById(id);
    console.log(user.email + " Triggered");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    } else {
      res.status(200).json({ success: true, data: user });
    }
  }catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Server has an Error", error: error.message });
  }
}


//delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Server has an Error", error: error.message });
  }
};   

//---adminController.js---

export const adminSignup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = signupSchema.validate({ email, password });

    if (error) {
      return res.status(401).json({ success: false, message: error.details[0].message });
    }

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(401).json({ success: false, message: "Admin already exists" });
    }

    const hashedPassword = await doHash(password, 12);

    const newAdmin = new Admin({
      email,
      password: hashedPassword,
    });

    const result = await newAdmin.save();
    result.password = undefined;
    res.status(201).json({ success: true, data: result, message: "Admin created successfully" });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const result = await doHashValidation(password, admin.password);
        if(!result){
          return res.status(401).json({success:false, message: "Invalid password"});
        };

      const token = jwt.sign({ email: admin.email, id: admin._id }, process.env.TOKEN_SECRET, {
      expiresIn: "8h"
      });

      res.cookie(
        'Authorization', 'Bearer' 
        + token ,{expires : new Date(Date.now() + 8 * 3600000),
         httpOnly: process.env.NODE_ENV === 'production',
         secure: process.env.NODE_ENV === 'production'
     }).json({success:true, data: admin, token: token, message: "User logged in successfully"});


  }catch(error){
     return res.status(500).json({success:false, message: error.message});
  }
}

export const adminSignout = async (req, res) => {
  res.clearCookie('Authorization');
  res.json({success:true, message: "Admin logged out successfully"});
}




export default {
  //user
  signup,
  signin,
  signout,
  sendVerificationEmail,
  verifyCode,
  getSignedInUser,
  getUser,
  deleteUser,
  //admin
  adminLogin,
  adminSignup,
  adminSignout
};

