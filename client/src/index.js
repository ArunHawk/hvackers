import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { msalConfig } from './pages/Main/authConfig';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';


const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <MsalProvider instance={msalInstance}>
          <App />
      </MsalProvider>
);

