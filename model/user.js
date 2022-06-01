const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const Token = require('./Token')

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid')
        }
      },
    },
    emailToken: {
      type: String, 
    },
    isVerified: {
      type: Boolean,

    },
    password: {
      type: String,
      required: true,
      minLength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error('Password is too common!')
        }
      },
    },
    avatar: {
      type: Buffer,
    },

    roles: {
      type: [String],
      enum: ['admin', 'user', 'super_admin'],
      default: ['user']
    }
  },
  {
    timestamps: true,
  },
)

// userSchema.methods.toJSON = function () {
//   const user = this

//   const userObj = user.toObject();

//   // delete userObj.password;
//   // delete userObj.tokens;
//   // delete userObj.avatar;

//   return userObj;
// }

// userSchema.methods = {
//   createAccessToken: async function () {
//     try {
//       const user = this
//       let accessToken = jwt.sign(
//         { _id: user._id.toString() },
//         ACCESS_TOKEN_SECRET,
//         {
//           expiresIn: '10m',
//         },
//       )
//       return accessToken
//     } catch (error) {
//       console.error(error)
//       return
//     }
//   },
//   createRefreshToken: async function () {
//     try {
//       const user = this
//       let refreshToken = jwt.sign(
//         { _id: user._id.toString() },
//         REFRESH_TOKEN_SECRET,
//         {
//           expiresIn: '1d',
//         },
//       )

//     user.tokens = user.tokens.concat({ token: refreshToken });
//     await user.save();
  
//       // await new Token({ token: refreshToken }).save();

//       return refreshToken
//     } catch (error) {
//       console.error(error)
//       return
//     }
//   },
// }

// userSchema.methods.generateAuthToken = async function() {
//     const user = this;
//     const token = jwt.sign({_id: user._id.toString() }, ACCESS_TOKEN_SECRET);

//     user.tokens = user.tokens.concat({ token });
//     await user.save();
    
//     return token;
// }


// Checking user credentials
// userSchema.statics.findByCredentials = async (email, password) => {
//    const user = this;
//      await user.findOne({ email });

//     if(!user) {
//         throw new Error('User not found');
//     }

//     const isMatch = bcrypt.compareSync(password, user.password);

//     if(!isMatch) {
//         throw new Error('Password incorrect');
//     }
    
//     return user;
// }



//pre save hook to hash password before saving user into the database:
userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  return next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
