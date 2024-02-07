// models/File.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: String,
    path: String,
    expiryDate: Date,
    passwordHash: String,
    accessLink: String
});

module.exports = mongoose.model('File', fileSchema);
