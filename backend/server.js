// server.js
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors')
const app = express();
const port = 3002;
app.use(cors())

// Sample file data with hashed passwords and expiry dates
const files = [
    { name: 'file1.txt', passwordHash: '$2b$10$j1MldTK9JmlJ4rNRd0Ij1u4l/.Sjn8QswXxQKq0L4NBp5l5x3WT4O', expiryDate: null }, // Password: secret
    { name: 'file2.txt', passwordHash: null, expiryDate: new Date('2024-02-20T12:00:00') } // No password, expires on Feb 20, 2024
];

// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage });

// Middleware for parsing application/json
app.use(bodyParser.json());

// Route for handling file uploads
app.post('/upload', upload.single('file'), (req, res) => {
    const { file, body: { password, expiryDate } } = req;

    // Check if a password is provided
    if (password) {
        // Hash the password
        bcrypt.hash(password, 10, (err, passwordHash) => {
            if (err) {
                return res.status(500).json({ error: 'Error hashing password' });
            }
            // Store file data with hashed password and expiry date
            files.push({ name: file.originalname, passwordHash, expiryDate });
            console.log('File uploaded successfully with password');
            res.status(200).json({ message: 'File uploaded successfully with password' });
        });
    } else {
        // Store file data with no password and expiry date
        files.push({ name: file.originalname, passwordHash: null, expiryDate });
        console.log('File uploaded successfully');
        res.status(200).json({ message: 'File uploaded successfully' });
    }
});

// Route for handling file access
app.get('/files/:filename', (req, res) => {
    const { filename } = req.params;
    const fileData = files.find(f => f.name === filename);

    if (!fileData) {
        return res.status(404).json({ error: 'File not found' });
    }

    // Check if file has expired
    if (fileData.expiryDate && new Date() > new Date(fileData.expiryDate)) {
        return res.status(403).json({ error: 'File link has expired' });
    }

    // Add logic to send file to client
    res.status(200).json({ message: 'File accessed successfully' });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
