import React, { useState } from 'react';
import 'tachyons';
const Upload = ({route,setRoute}) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [password, setPassword] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [uploadLink, setUploadLink] = useState('');
    const [hasUploaded, sethasUploaded] = useState(false);

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

        fetch('https://3002-fabc14-filesharing-xgtdu2tg3y7.ws-us108.gitpod.io/upload', {
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
            setUploadLink(data.accessLink); // Store the upload link in state
            sethasUploaded(true);
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
<div className="container center shadow-1 mt-5 v-md">
    <div className="row justify-content-center align-items-center">
        <div className="col-md-6 mt-3">
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {hasUploaded && ( // Display the link if it exists
            <div className="alert alert-success">
                File uploaded successfully. Access link: 
                <div className='container-fluid'>
                    <code>{uploadLink}</code>
                </div>
            </div>
            )}
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
            <button className="btn btn-primary mt-3 ma2 pa2 shadow-2 b" onClick={handleUpload}>Upload</button>
            <button className="btn btn-warning mt-3 ma2 pa2 shadow-2 b" onClick={()=>setRoute('fileAccess')}>View File</button>

        </div>
    </div>
</div>
    );
};

export default Upload;
