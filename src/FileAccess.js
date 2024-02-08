import React, { useState } from 'react';

const FileAccess = () => {
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
    
        const requestData = {
            link,
            password // Include the password in the request data
        };
    
        fetch(`https://3002-fabc14-filesharing-py16ytglgyo.ws-us108.gitpod.io/files/${link}`, {
            method: 'POST', // Change the method to POST
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
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
            console.error('Error accessing file:', error);
            if (error.message === 'Password is required to access the file') {
                // Prompt the user to enter the password and retry the request
                const enteredPassword = prompt('Password is required to access the file. Please enter the password:');
                if (enteredPassword) {
                    setPassword(enteredPassword);
                    handleFileAccess(); // Retry the request with the entered password
                } else {
                    setErrorMessage('Password is required to access the file');
                }
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
                    <button onClick={handleFileAccess} className='mr-2 mt-3'>Access File</button>
                </div>
            </div>
        </div>
    );
};

export default FileAccess;
