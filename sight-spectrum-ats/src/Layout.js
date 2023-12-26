import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import styles from './Layout.module.css';
import { Outlet } from 'react-router-dom';
import AccountSettingModal from './pages/AccountSettingModal';

function Layout(props) {

    const[isModalOpen, setIsModalOpen] = useState(false)

    return(
        
        <div className={styles.container}>
            <Header setIsModalOpen={setIsModalOpen} />
            <div className={styles.pannel}> 
                <div className={styles.sidebar}>
                    <Sidebar  />
                </div>
                <div className={styles.page}>
                    <AccountSettingModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
                    <Outlet/> 
                </div> 
            </div>
    
        </div>

    );
};

export default Layout;