import React from 'react';
import ReactDOM from 'react-dom/client'; // Import the new client
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; // Assure-vous d'inclure le CSS de Bootstrap si nécessaire

// Get the root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);