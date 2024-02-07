// server.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const File = require('./models/File');

const app = express();
const port = 3002;

// MongoDB connection
mongoose.connect('<your-mongodb-atlas-connection-string>', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB Atlas');
});

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage });

// Route for file upload
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        // Get file details from request
        const { filename, path, expiryDate, password } = req.body;

        // Hash password if provided
        let passwordHash = null;
        if (password) {
            passwordHash = await bcrypt.hash(password, 10);
        }

        // Create access link (you can use a random token)
        const accessLink = jwt.sign({ filename }, 'secret');

        // Save file metadata to MongoDB
        const file = new File({ filename, path, expiryDate, passwordHash, accessLink });
        await file.save();

        res.status(201).json({ message: 'File uploaded successfully', accessLink });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route for file access
app.get('/files/:accessLink', async (req, res) => {
    try {
        const { accessLink } = req.params;

        // Find file by access link
        const file = await File.findOne({ accessLink });

        // Check if file exists
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Check expiry date
        if (file.expiryDate && new Date() > file.expiryDate) {
            return res.status(403).json({ error: 'File link has expired' });
        }

        // If file is password protected, return response indicating password is required
        if (file.passwordHash) {
            return res.status(401).json({ error: 'Password is required to access the file' });
        }

        // Add logic to send file to client
        res.status(200).json({ message: 'File accessed successfully' });
    } catch (error) {
        console.error('Error accessing file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
