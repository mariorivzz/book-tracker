const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    rating: { type: Number, min: 1, max: 10 },
    read: { type: Boolean, default: false }
});

module.exports = mongoose.model("Book", BookSchema);