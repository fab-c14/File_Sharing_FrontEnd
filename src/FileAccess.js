import React, { useState } from 'react';

const FileAccess = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [link, setLink] = useState('');

    const handleLinkChange = (event) => {
        setLink(event.target.value);
    };

    const handleFileAccess = () => {
        if (link.trim() === '') {
            setErrorMessage('Please enter a valid access link');
            return;
        }

        fetch(`https://3002-fabc14-filesharing-ysd56aovepz.ws-us108.gitpod.io/files/${link}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('File accessed successfully:', data);
                // Add logic to handle file access
            })
            .catch(error => {
                console.error('Error accessing file:',error);
                // if (error.response.status === 403) {
                //     setErrorMessage('File link has expired');
                // } else if (error.response.status === 401) {
                //     setErrorMessage('Password is required to access the file');
                // } else if (error.response.status === 404) {
                //     setErrorMessage('File not found');
                // } else {
                //     setErrorMessage('Error accessing file');
                // }
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
                    
                    <button onClick={handleFileAccess} className='mr-2'>Access File</button>
                </div>
            </div>
        </div>
    );
};

export default FileAccess;
