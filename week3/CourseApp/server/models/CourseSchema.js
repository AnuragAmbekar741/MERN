const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    category: { type: String },
    price: { type: Number },
    imageLink: { type: String },
    published: { type: Boolean },
    createdBy: {
        name: { type: String },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    reviews: [
        {
            text: { type: String },
            rating: { type: Number },
            date: { type: Date },
            username: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }
    ]
})

const Course = mongoose.model("Course", CourseSchema)

module.exports = { Course }