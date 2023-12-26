import React,{useEffect,useState} from 'react'
import { Modal } from '@fluentui/react'
import styles from './Popup.module.css'
import { Icon } from '@fluentui/react/lib/Icon';
import {PrimaryButton, DefaultButton} from '@fluentui/react';
import { axiosPrivateCall } from "../constants";

 
  export function DeletePopup(props) {
     
    let showPopup = props.showPopup;
    let setShowPopup = props.setShowPopup;
    let updateCallout=props.updateCallout
    let setUpdateCallout=props.setUpdateCallout
    let deleteObj = props.deleteId;

    const handleUpdate=()=>{
         props.handleUpdate(!showPopup)
        
        }
    

    return(
    <>
    
        <Modal isOpen={showPopup} containerClassName={styles.main_PopUp_Container}>

            <div className={styles.closePopup}>
                <div className={styles.topContainer}>
                
                    <div className={styles.title}>Are you sure you want to delete this item?</div>

                    <div className={styles.closeButton} onClick={() => setShowPopup(!showPopup)}><Icon iconName='ChromeClose'/></div>
                </div>

                <div className={styles.message}><b>{deleteObj._id}</b>  You can proceed with the deletion, or cancel to keep the item.</div>
                
                <div className={styles.bottomContainer}>
                    <div className={styles.spacer}></div>
                    <div className={styles.buttonContainer}>
                        <DefaultButton text={`Cancel`} onClick={() => {
                            setUpdateCallout(!updateCallout)
                            setShowPopup(!showPopup)}}
                            />
                        <PrimaryButton text={`Delete`} 
                            onClick={() => {
                                handleUpdate() }}/>
   
                    </div>
                </div>
               
            </div>
        </Modal>
    </>
    )
}
