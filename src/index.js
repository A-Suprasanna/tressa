import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from "./pages/AuthContext";


const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <AuthProvider>
  <App />
</AuthProvider>
);

reportWebVitals();
