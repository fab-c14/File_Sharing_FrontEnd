import React, { useState } from 'react';

const Upload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [password, setPassword] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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
        if (!selectedFile) {
            setErrorMessage('Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('password', password);
        formData.append('expiryDate', expiryDate);

        fetch('https://3002-fabc14-filesharing-x7esvkougck.ws-us108.gitpod.io/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('File uploaded successfully:', data);
            setErrorMessage(data);
            // Add any additional logic here, such as updating UI
            setSelectedFile(null);
            setPassword('');
            setExpiryDate('');
            setErrorMessage('');
        })
        .catch(error => {
            console.error('Error uploading file:', error);
            setErrorMessage('Error uploading file. Please try again.');
        });
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 mt-3">
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    <div className="form-group mt-3">
                        <label htmlFor="fileInput">
                        <input type="file" className="form-control-file" id="fileInput" onChange={handleFileChange} />
                        </label>
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="passwordInput">Password (Optional)</label>
                        <input type="password" className="form-control" id="passwordInput" value={password} onChange={handlePasswordChange} />
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="expiryDateInput">Expiry Date and Time (Optional)</label>
                        <input type="datetime-local" className="form-control" id="expiryDateInput" value={expiryDate} onChange={handleExpiryDateChange} />
                    </div>
                    <button className="btn btn-primary mt-3" onClick={handleUpload}>Upload</button>
                </div>
            </div>
        </div>
    );
};

export default Upload;
