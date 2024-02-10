import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Upload from './Upload';
import FileAccess from './FileAccess';
import 'tachyons'
const App = () => {
    const [route, setRoute] = useState('home');

    const renderContent = () => {
        switch (route) {
            case 'upload':
                return <Upload />;
            case 'fileAccess':
                return <FileAccess />;
            default:
                return (
                    <div className="home-page text-center">
                        <h2 className="mb-4 text-pop-up-top f1 grey">Welcome to File Sharing PlateForm</h2>
                        <div className="d-flex justify-content-center">
                            <button onClick={() => setRoute('upload')} className="btn btn-primary shadow-1 b pa2 ma1" route={route} setRoute={setRoute}>Upload File</button>
                            {" "}
                            <button onClick={() => setRoute('fileAccess')} className="btn btn-success  shadow-1 b pa2 ma1" route={route} setRoute={setRoute}>View Files</button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className='App'>
            {renderContent()}
        </div>
    );
};

export default App;
