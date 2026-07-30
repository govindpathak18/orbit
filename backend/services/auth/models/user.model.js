import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    avatar: {
        type: String,
    },
    provider: {
        type: String,
    },
    plan: {
        type: String,
        default: "Free",
    },
    credits: {
        type: Number,
        default: 100,
    },
    totalCredits: {
        type: Number,
        default: 100,
    },
    planExpiresAt: {
        type: Date,
    },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;