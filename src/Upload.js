import React, { useState } from 'react';
import axios from 'axios';

const Upload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [password, setPassword] = useState('');
    const [expiryDate, setExpiryDate] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleExpiryDateChange = (event) => {
        setExpiryDate(event.target.value);
    };

    const handleUpload = () => {
        // Implement file upload logic
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="fileInput">Choose File</label>
                        <input type="file" className="form-control-file" id="fileInput" onChange={handleFileChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="passwordInput">Password (Optional)</label>
                        <input type="password" className="form-control" id="passwordInput" value={password} onChange={handlePasswordChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="expiryDateInput">Expiry Date and Time (Optional)</label>
                        <input type="datetime-local" className="form-control" id="expiryDateInput" value={expiryDate} onChange={handleExpiryDateChange} />
                    </div>
                    <button className="btn btn-primary" onClick={handleUpload}>Upload</button>
                </div>
            </div>
        </div>
    );
};

export default Upload;
