import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'tachyons';
import Upload from './Upload';
import FileAccess from './FileAccess';

const App = () => {
    return (
        <div className='App'>
            <h1>File Sharing App</h1>
            <Upload />
            <FileAccess />
        </div>
    );
};

export default App;

