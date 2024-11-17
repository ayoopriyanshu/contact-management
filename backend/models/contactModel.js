import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String
    },
    company: {
        type: String
    },
    jobTitle: {
        type: String
    },
    edited: {
        type: Boolean,
        default: false
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
