const express = require('express');
const {signup, signin, generateRefreshToken, userMe, logout, getAllUsers, getUserId, updateUserMe, changePassword, passwordResetEmail, userAvatar, verifyPasswordReset, resetPassword, verifyEmailLink} = require('../controller/user')
const multer = require('multer');
const auth = require('../middleware/auth');
const checkVerifiedEmail = require('../middleware/checkVerifiedEmail');
const router = new express.Router();

const upload = multer({
  dest: 'uploads/images/',
  limits: {
    fileSize: 2000000
  },
  fileFilter(req, file, cd){
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cd(new Error("Please upload only jpg, jpeg or png"))
    }

    cd(undefined, true)
  }
})

//@route POST /api/auth/signup
router.post('/auth/signup', signup)

//@route POST /api/auth/signin
// router.post('/auth/signin', checkVerifiedEmail, signin);
router.post('/auth/signin', signin);

//@route POST /api/auth/upload
router.post('/user/avatar', auth, upload.single('upload'), userAvatar);

//@route POST /api/auth/refreshed Token
router.post('/auth/refresh_token', generateRefreshToken);

//@route POST /api/auth/user me
router.get('/user/me', auth, userMe)

//@route POST /api/auth/logout
router.delete('/auth/logout', auth, logout)

//@route POST /api/auth/users
router.get('/users', auth, getAllUsers)

//@route POST /api/auth/userId
router.get('/users/:id', auth, getUserId)

//@route POST /api/auth/updateMe
router.patch('/users/me', auth, updateUserMe)

//@route POST /api/auth/updatePassword
router.put('/auth/updatePassword', auth, changePassword)

//@route POST /api/auth/password reset link
router.post('/auth/passwordResetLink',  passwordResetEmail)

//@route POST /api/auth/password reset link
router.get('/verifyLink/:id/:token',  verifyPasswordReset)

//@route POST /api/auth/password reset 
router.post('/passwordreset/:id/:token',  resetPassword)

//@route POST /api/auth/verify-email-link
router.get('/verify-email', verifyEmailLink)



module.exports = router;