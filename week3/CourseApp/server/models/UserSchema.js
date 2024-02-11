const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: {type: String},
    password: {type:String},
    purchasedCourses : [{type:mongoose.Schema.Types.ObjectId,ref:'Course'}]
})

const User = mongoose.model("User",UserSchema)

module.exports = {User}