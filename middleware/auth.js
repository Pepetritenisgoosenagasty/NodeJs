
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const privateKey = process.env.ACCESS_TOKEN_SECRET;
const cookie = require('cookie-parser')



//middleware function to check if the incoming request in authenticated:
const auth = async (req, res, next) => {
 try {
      //  const token = req.header('Authorization').replace('Bearer ', '');
      const token = req.cookies['accessToken'];
      
      if (!token) {
        return res.status(403).json({error: true, message:"Access denied, no token found"});
      } else {
        const tokenDetails = jwt.verify(token, privateKey);
         const user = await User.findOne({_id: tokenDetails._id})


         req.token = tokenDetails;
         req.user = user;
        next()
      }
   } catch (error) {
        // token can be expired or invalid. Send appropriate errors in each case:
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ error: "Session timed out,please login again" });
      } else if (error.name === "JsonWebTokenError") {
        return res
          .status(401)
          .json({ error: "Invalid token,please login again!" });
      } else {
        //catch other unprecedented errors
        console.error(error);
        return res.status(403).json({ error: true, message: "Internal Server Error" });
      }
   }
};

module.exports = auth ;