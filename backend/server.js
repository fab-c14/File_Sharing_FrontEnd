const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const File = require('./models/File');
const path = require('path');
const express = require('express');
const multer = require('multer');
const cors = require('cors');

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

app.get('/', (req, res) => {
    res.json("hello world");
});

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { filename, path: filePath } = req.file;
        const { expiryDate, password } = req.body;

        let passwordHash = null;
        if (password) {
            passwordHash = await bcrypt.hash(password, 10);
        }

        const accessLink = jwt.sign({ filename, expiryDate }, passwordHash || '');

        const file = new File({ filename, path: filePath, expiryDate, passwordHash, accessLink });
        await file.save();

        res.status(201).json({ message: 'File uploaded successfully', accessLink });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/files/:accessLink', async (req, res) => {
    try {
        const { accessLink } = req.params;
        const { password } = req.query;
        
        const file = await File.findOne({ accessLink });

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

        const filePath = path.resolve(__dirname, 'uploads', file.filename);

        // Get the file extension
        const fileExtension = path.extname(file.filename);

        // Set appropriate content type based on file extension
        const contentType = getContentType(fileExtension);
        if (!contentType) {
            return res.status(500).json({ error: 'Unsupported file type' });
        }

        // Set headers for previewing the file
        res.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);
        res.setHeader('Content-Type', contentType);

        // Send the file
        res.sendFile(filePath);

    } catch (error) {
        console.error('Error accessing file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Function to get content type based on file extension
function getContentType(fileExtension) {
    switch (fileExtension) {
        case '.pdf':
            return 'application/pdf';
        case '.doc':
        case '.docx':
            return 'application/msword';
        case '.xls':
        case '.xlsx':
            return 'application/vnd.ms-excel';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.gif':
            return 'image/gif';
        case '.mp4':
            return 'video/mp4';
        case '.avi':
            return 'video/x-msvideo';
        // Add more cases for other file types as needed
        default:
            return null; // Unknown file type
    }
}


app.listen(port, () => {
    console.log(`Server is listening on port http://localhost:${port}`);
});
