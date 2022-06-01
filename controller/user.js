const User = require('../model/user')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const bcrypt = require('bcryptjs')
const Token = require('../model/Token')
const { sendResetPasswordMail, verifyMail } = require('../email/sendUrlMail')
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
const generateTokens = require('../utils/generateTokens')
const verifyRefreshToken = require('../utils/verifyRefreshToken')
const jwt = require('jsonwebtoken');
const Avatar = require('../model/Avatar')
const cookie = require('cookie-parser')
const crypto = require('crypto')




// Signup controller function
const signup = async (req, res, next) => {
  try {
    //check if email is already taken:
    let user = await User.findOne({ email: req.body.email })
    if (user) {
      return res.status(400).json({ error: 'email already exist.' })
    } else {
      user = await new User(req.body);
      user.emailToken = crypto.randomBytes(64).toString('hex');
      user.isVerified = false; 

      await user.save();

        // Email Content 
       const name = user.firstName + ' ' + user.lastName;
       const email = user.email;
       const url = req.headers.host;
       const token = user.emailToken

      

        // Send Email
        verifyMail({name, email, url, token})
      return res.status(201).json({ error: false, message: 'user registered successfully, Kindly verify your email !!'})
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
}

// Login controller function
const signin =  async (req, res) => {
  try {
    //check if user exists in database:
    let user = await User.findOne({ email: req.body.email });
    //send error if no user found:
    if (!user) {
      return res.status(404).json({ error: "No user found!" });
    } else {
      //check if password is valid:
      let valid = await bcrypt.compare(req.body.password, user.password);
      if (valid) {
        //generate a pair of tokens if valid and send
        const { accessToken, refreshToken } = await generateTokens(user)
        res.cookie('accessToken', accessToken);
        res.cookie('refreshToken', refreshToken);
        return res.status(201).json({ error: false, message: "Login Successful" });
      } else {
        //send error if password is invalid
        return res.status(401).json({ error: "Invalid password!" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error!" });
  }
}


// Upload Image
const userAvatar = async (req, res) => {
   const file = req.file;
  try {
    // const buffer = await sharp(req.file.filename.buffer).resize({width: 250, height: 250}).png().toBuffer()

    
   
   if(!file) {
return res.status(400).json({message: "File is required"})
   }else {
      const avatar =  new Avatar({userId: req.user._id ,avatar: file.filename})

    await avatar.save()

    return res.status(200).json({message: "Avatar Upload Successfully"})
   }
  } catch (error) {
    return res.status(500).json({message: "Internal Server Error!"})
  }
}


// verify-email link
const verifyEmailLink =  async (req, res) => {
  try {
    const token = req.query.token
    const user = await User.findOne({emailToken: token})

    if(user) {
      user.emailToken = null;
      user.isVerified = true;

      await user.save();
      return res.status(200).json({message: "Email verified!"})
    } else {
      return res.status(400).json({error: true, message: "Email not verified!"})
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
}


// Send password reset email
const passwordResetEmail = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email })
    let token = await Token.findOne({userId: user._id})
    if (!user) {
      return res.status(409).json({ error: 'User with given email does not exist' });
    } 

    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex")
      }).save();
    }

    const url = `${process.env.BASE_URL}password-reset/${user._id}/${token.token}`;
    await sendResetPasswordMail(user.email, "Password Reset", url);

    res.status(200).json({message: 'Password Reset Link Sent successfully'})
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
}

// verify url
const verifyPasswordReset = async (req, res) => {
try {
  const user = await User.findOne({_id: req.params.id})

  if (!user) {
    return res.status(404).json({ message: "Invalid Link"})
  }

  const token = await Token.findOne({
    userId: user._id, token: req.params.token,
  })

  if(!token) {
    return res.status(404).json({ message: "Invalid Link"})
  }

  res.status(200).json({ message: "Valid Url"})
} catch (error) {
  return res.status(500).json({ error: "Internal Server Error!" })
}
}

// Reset password
const resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.params.id})
    const token = await Token.findOne({userId: user._id, token: req.params.token})
    if (!user) {
      return res.status(409).json({message: 'Invalid link'})
    }

    if (!token) {
      return res.status(403).json({message: 'Invalid link'})
    }

    if(!user.verified) user.verified = true;

    const hashedPassword =  bcrypt.hashSync(req.body.password);
    user.password = hashedPassword
    await user.save();
    await token.remove();

    res.status(200).json({message: "Password Reset Successfully"})
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
}

// Updated login user details
const updateUserMe = async(req, res) => {
   const updates = Object.keys(req.body);
   const allowedUpdate = ["firstName", "lastName", "email", "gender"];
   const isValidOperation = updates.every((update) => allowedUpdate.includes(update));
   
   if(!isValidOperation){
     return res.status(400).send({ error: 'Invalid updates!'});
   }
 
   try {
     updates.forEach((update) => req.user[update] = req.body[update]);
     await req.user.save();
     
     res.send(req.user);
   } catch (e) {
     res.status(400).send(e);
   }
}

const changePassword = async (req, res) => {
   try {
    let current_user = req.user;
    const { current_password, new_password } = req.body;
    
    if(!current_password) {
      return res.status(401).json({ message: "Current password is required" });
    } else if(!new_password) {
      return res.status(401).json({ message: "New password is required"})
    }
    
    const matchedCurrentPassword =  bcrypt.compareSync(current_password, current_user.password)

    if (matchedCurrentPassword) {
      let hashedPassword = bcrypt.hashSync(req.body.new_password)
      await User.updateOne({
        _id: current_user._id
      },{
        password: hashedPassword
      })

      return res.status(200).json({message: "Password changed successfully"})
    } else {
      return res.status(401).json({ message: "Current password does not match"})
    }

   } catch (e) {
     res.status(400).send(e.message);
   }
}


// Generate refreshToken function
const generateRefreshToken = async (req, res) => {
try {
    //get refreshToken
    const { refreshToken } = req.body;
    //send error if no refreshToken is sent
    if (!refreshToken) {
      return res.status(403).json({ error: "Access denied,token missing!" });
    } else {
     verifyRefreshToken(refreshToken)
       .then(({tokenDetails}) => {
         const payload = {_id: tokenDetails._id, roles: tokenDetails.roles}
         const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {expiresIn: "14m"});

         res.status(200).json({error: false, accessToken, message: "Access token created successfully"})
       }).catch(err => res.status(400).json({error: err.message}))
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error!" });
  }
}

// generate logged in user details
const userMe = async (req, res) => {
  const user = await res.status(200).json({ user: req.user });

  return user;
}


// Get all users
const getAllUsers = async (req, res) => {
   try {
     const users = await User.find({});
     res.send(users);
   } catch (e) {
     res.status(500).json({message: e.message});
   }
}

const getUserId = async (req, res) => {
   const _id = req.params.id;
 
   try {
     const user = await User.findById(_id)
     if(!user) {
       return res.status(404).json({ message: "User not found"});
     }
 
     res.status(200).json({user});
   } catch (e) {
     res.status(500).json({ error: "Internal Server Error!" });
   }
}

// Logout
const logout = async (req, res) => {
  try {
    // const { refreshToken } = req.body;

    // const { refreshToken } = req.cookies['accessToken'];
    
    // if (!refreshToken) {
    //   return res.status(401).json({message: 'Invalid link'})
    // } else {
    //   const token = await Token.findOne({token: refreshToken})

    //   if(!token)
    //  return res.status(400).json({ error: true, message: 'Invalid token'})

    //  await token.remove()
    //  res.cookie('accessToken', "", { maxAge: 1 })
    //  res.status(200).json({ message: 'Logout Successfully' });
    // }
     res.cookie('accessToken', "", { maxAge: 1 })
     res.status(200).json({ message: 'Logout Successfully' });

  } catch (error) {
    return res.status(500).json({message:"Internal Server Error!"})
  }
}

module.exports = { signup, signin, generateRefreshToken, userMe, logout, getAllUsers, getUserId, updateUserMe, changePassword, passwordResetEmail, resetPassword, userAvatar, verifyPasswordReset, verifyEmailLink }
