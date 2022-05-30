const jwt = require('jsonwebtoken');
const Token = require('../model/Token')
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env


const generateTokens = async (user) => {
 try {
     const payload = {_id: user._id, roles: user.roles};

     const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
         expiresIn: "14m"
     });

     const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
         expiresIn: "30d"
     })

     const userToken = await Token.findOne({userId: user._id})

     if(userToken)  await userToken.remove();
         await new Token({userId: user._id, token: refreshToken}).save()

     return Promise.resolve({accessToken, refreshToken})
 } catch (error) {
     Promise.reject(error)
 }
}

module.exports = generateTokens