const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true
    },
    requiredURL: {
        type: String,
        required: true
    },
    visitHistory: [{ timestamps: { type: Number } }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }

}, { timestamps: true }
);


const URL = mongoose.model('url', userSchema);

module.exports = URL;