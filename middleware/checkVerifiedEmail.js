const User = require("../model/user")


const checkVerifiedEmail = async (req, res, next) => {
    console.log(`${process.env.NODEMAILER_AUTH_EMAIL}`)
    try {
        const user = await User.findOne({ email: req.body.email});

        if (user.isVerified) {
            next()
        } else {
            return res.status(200).json({ error: false, message: "Please check mail to verify your account." });
        }
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error!"})
    }
}

module.exports = checkVerifiedEmail