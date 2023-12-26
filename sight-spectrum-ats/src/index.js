import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@fluentui/react';
import { darkTheme, lightTheme } from '../src/themes';
import {BrowserRouter as Router} from "react-router-dom";
import {SocketProvider} from './components/providers/SocketProvider'

import { initializeIcons } from '@fluentui/font-icons-mdl2';

initializeIcons();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   
 


    <ThemeProvider  theme={lightTheme}>
      <Router>
        <SocketProvider>
        <App/>
        </SocketProvider>
      </Router>
    </ThemeProvider>




 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
