import React from 'react';
import ReactDOM from 'react-dom/client'; // Import the createRoot API
import './index.css';
import App from './App.tsx';


// Use createRoot to render the application
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);


