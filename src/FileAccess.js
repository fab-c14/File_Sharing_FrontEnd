import React, { useState } from 'react';

const FileAccess = ({route,setRoute}) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [link, setLink] = useState('');
    const [password, setPassword] = useState('');

    const handleLinkChange = (event) => {
        setLink(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleFileAccess = () => {
        if (link.trim() === '') {
            setErrorMessage('Please enter a valid access link');
            return;
        }
    
        fetch(`https://3002-fabc14-filesharing-xgtdu2tg3y7.ws-us108.gitpod.io/files/${link}?password=${password}`, {
            method: 'GET', // Change the method to GET
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log(response)
            // Return the blob data and filename
            return response.blob().then(blob => ({ blob}));
        })
        .then(({ blob }) => {
            // Check if the blob data is valid
            if (!blob || !blob.size) {
                throw new Error('Invalid blob data');
            }
            // Create a blob URL to display the file
            const url = URL.createObjectURL(blob);
            // Open the file in a new tab
            window.open(url, '_blank');
            // Revoke the blob URL to release memory
            URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error accessing file:', error);
            if (error.message === 'Password is required to access the file') {
                setErrorMessage('Password is required to access the file');
            } else {
                setErrorMessage('Error accessing file');
            }
        });
    };
    

    return (
        <div className='container mt-3'>
            <div className="row justify-content-center">
                <div className="col-md-6 mt-3 ml-2">
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    <div className="form-group mt-3">
                        <label htmlFor="linkInput">Enter Access Link</label>
                        <input type="text" className="form-control" id="linkInput" onChange={handleLinkChange} />
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="passwordInput">Password (Optional)</label>
                        <input type="password" className="form-control" id="passwordInput" value={password} onChange={handlePasswordChange} />
                    </div>
                    <button onClick={handleFileAccess} className='mr-2 mt-3 ma2 pa2 shadow-2 b'>Access File</button>
                    <button className="btn btn-warning mt-3 ma2 pa2 shadow-2 b" onClick={()=>setRoute('upload')}>Upload File</button>

                </div>
            </div>
        </div>
    );
};

export default FileAccess;
