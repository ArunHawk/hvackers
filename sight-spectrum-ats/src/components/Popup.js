import React from 'react'
import { Modal } from '@fluentui/react'
import styles from './Popup.module.css'
import { Icon } from '@fluentui/react/lib/Icon';
import {PrimaryButton, DefaultButton} from '@fluentui/react';
import { mergeStyles, mergeStyleSets} from '@fluentui/react';

 
export function Popup(props) {

    let showPopup = props.showPopup;
    let setShowPopup = props.setShowPopup;
    let isModalOpen = props.isModalOpen;
    let setIsModalOpen = props.setIsModalOpen;
    let resetState = props?.resetState;

    return(
    <>
        <Modal isOpen={showPopup} containerClassName={styles.mainContainer}>

            <div className={styles.closePopup}>
                <div className={styles.topContainer}>

                    <div className={styles.title}>Are you sure you want to leave the page?</div>

                    <div className={styles.closeButton} onClick={() => setShowPopup(!showPopup)}><Icon iconName='ChromeClose'/></div>
                    
                </div>

                <div className={styles.message}>You have unsaved changes. You can discard your changes, or cancel to continue editing.</div>
                
                <div className={styles.bottomContainer}>
                    <div className={styles.spacer}></div>
                    <div className={styles.buttonContainer}>
                        <DefaultButton text={`Cancel`} onClick={() => setShowPopup(!showPopup)}/>
                        <PrimaryButton text={`Discard Changes`} 
                            onClick={() => {
                                            if (props.resetState)
                                            {
                                                setShowPopup(!showPopup);
                                                resetState(); 
                                                setIsModalOpen(!isModalOpen);
                                            } else {
                                                setShowPopup(!showPopup);
                                                setIsModalOpen(!isModalOpen);

                                            }}}/>
                    </div>
                </div>
               
            </div>
        </Modal>
    </>
    )
}