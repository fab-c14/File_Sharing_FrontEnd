import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'tachyons';
import Upload from './Upload';

function App() {
  return (
    <div className="App d-flex justify-content-center align-items-center">
      <div className="text-center">
        <h1>File Sharing Platform</h1>
        <Upload />
      </div>
    </div>
  );
}

export default App;
