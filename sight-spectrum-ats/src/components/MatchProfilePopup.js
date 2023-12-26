import React from 'react'
import { Modal } from '@fluentui/react'
import styles from './Popup1.module.css'
import { Icon } from '@fluentui/react/lib/Icon';
import {PrimaryButton, DefaultButton} from '@fluentui/react';
import { mergeStyles, mergeStyleSets} from '@fluentui/react';
import { useNavigate,useLocation } from "react-router-dom";
 
export function MatchProfilePopup(props) {

    let showProfilePopup = props.showProfilePopup;
    let setShowProfilePopup = props.setShowProfilePopup;
    let isModalOpen = props.isModalOpen;
    let setIsModalOpen = props.setIsModalOpen;
    let resetState = props?.resetState;
    const navigateTo = useNavigate();
    const location = useLocation();
    const state=props.state;

    return(
    <>
        <Modal isOpen={showProfilePopup} containerClassName={styles.mainContainer}>

            <div className={styles.closePopup}>
                <div className={styles.topContainer}>

                    <div className={styles.title}>You have a few Matching {state==='candidate'?'Demands':'Profiles'} !</div>

                    <div className={styles.closeButton} onClick={() => setShowProfilePopup(!showProfilePopup)}><Icon iconName='ChromeClose'/></div>
                    
                </div>

                <div className={styles.message}>New demand has been created. Click "View {state==='candidate'?'Demands':'Profiles'}" 
                <div>to view  {state==='candidate'?' similar Demands':'matching Profiles'}.</div></div>
                
                <div className={styles.bottomContainer}>
                    <div className={styles.buttonContainer}>
                        <PrimaryButton className={styles.buttonInside} text= {state==='candidate'?'View Demands':'View Profiles'}
                            onClick={() => {
                                            if (state==='candidate')
                                            {
                                                navigateTo('/demand/managedemands',{state:true})
                                            } else if(state==='demand'){
                                                navigateTo('/candidatelibrary/managecandidates',{state:true})
                                            }
                                        }
                                        }
                                            
                                            />
                    </div>
                </div>
               
            </div>
        </Modal>
    </>
    )
}