const mongoose = require('mongoose');
const User = require('./user');


const avatarSchema = mongoose.Schema({
     userId: {
    type: String,
    required: true,
  },
    avatar: {
        type: String
    }
},
{
    timestamps: true
})

avatarSchema.virtual('users', {
    ref: 'User',
    localField: '_id',
    foreignField: 'owner'
});

// Delete avatar when user is removed
avatarSchema.pre('remove', async function(next) {
  const user = this;
  await User.deleteMany({ owner: user._id });
  next();
})


module.exports = mongoose.model("Avatar", avatarSchema)