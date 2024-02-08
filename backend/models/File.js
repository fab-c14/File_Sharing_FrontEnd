const mongoose = require('mongoose');

// Define the schema for files
const fileSchema = new mongoose.Schema({
    filename: String,
    path: String,
    expiryDate: Date,
    passwordHash: String,
    accessLink: String
});

// Create a model for the schema
module.exports = mongoose.model('File', fileSchema);
