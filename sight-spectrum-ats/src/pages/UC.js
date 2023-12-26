import React from 'react';
import uc from '../assets/uc.png'
import Layout from '../Layout';

function UC() {

    return(
            <div style={{
                width: '100%',
                height: '80%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <img src={uc}/>
            </div>
    );

};

export default UC;