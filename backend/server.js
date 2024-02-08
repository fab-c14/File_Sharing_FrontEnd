const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const File = require('./models/File');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3002;
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://filesharing:YxOZDGOeDNgGPhXv@cluster0.3cwuykf.mongodb.net/?retryWrites=true&w=majority');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB Atlas');
});

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Route for file upload
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { filename, path: filePath } = req.file;
        const { expiryDate, password } = req.body;

        const passwordHash = password ? await bcrypt.hash(password, 10) : null;
        const accessLink = jwt.sign({ filename }, passwordHash);

        const file = new File({ filename, path: filePath, expiryDate, passwordHash, accessLink });
        await file.save();

        res.status(201).json({ message: 'File uploaded successfully', accessLink });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/uploads/:accessLink', async (req, res) => {
    try {
        const { filename } = req.params;
        const { password } = req.query;
        
        const file = await File.findOne({ filename });

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        if (file.expiryDate && new Date() > file.expiryDate) {
            return res.status(403).json({ error: 'File link has expired' });
        }

        if (file.passwordHash) {
            if (!password) {
                return res.status(401).json({ error: 'Password is required to access the file' });
            }

            const passwordMatch = await bcrypt.compare(password, file.passwordHash);
        
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Incorrect password' });
            }
        }

        // Send the file using the absolute path
        const filePath = path.resolve(__dirname, 'uploads', file.filename);

        // Set appropriate headers for file download
        res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
        res.setHeader('Content-Type', 'application/octet-stream');

        res.sendFile(filePath);

    } catch (error) {
        console.error('Error accessing file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.listen(port, () => {
    console.log(`Server is listening on port http://localhost:${port}`);
});
