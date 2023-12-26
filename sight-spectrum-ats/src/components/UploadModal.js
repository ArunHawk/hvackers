import React, { useState } from 'react'
import { Modal } from '@fluentui/react'
import styles from './UploadModal.module.css'
import { Icon } from '@fluentui/react/lib/Icon';
import {PrimaryButton} from '@fluentui/react';
import { mergeStyles} from '@fluentui/react';
import { useRef } from 'react'
import dropfile from "../assets/dropfile.svg"
import { axiosPrivateCall } from "../constants";
import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";

const tableCloseIconClass = mergeStyles({
	fontSize: 10,
	height: '12px',
	width: '12px',
	cursor: 'pointer',
	color: 'red'

});

 
export function UploadPopup(props) {

    let showPopup = props.showPopup;
    let setShowPopup = props.setShowPopup;
    let basicInfo = props.basicInfo;
    let setBasicInfo = props.setBasicInfo;
    const inputRef = useRef();
    const [isUploading, setIsUploading] = useState(false);

    function handleDragover (event) {
        event.preventDefault();
    };
    
    function handleDrop (event) {
        event.preventDefault();
        uploadDocs(event.dataTransfer.files);
    };

    function uploadDocs(files)
    {
        setIsUploading(true);
      
        let data = Object.values(files);
        const formData = new FormData();

        data.map((file,) => {
          formData.append("files", file)
        });
    
        axiosPrivateCall.post(`/api/v1/client/addClientDocuments`, formData)
        .then((res) => {
            let fileuploaded = res.data.documents;
            setBasicInfo((prev) => {
                let buffer = {...prev};
                buffer.documents.push(...fileuploaded)
                return buffer;
            });
            setIsUploading(false)
        }).catch((err) => {
            console.log(err)
        })
    };

    function removeUploadedDoc(key) {
        console.log(key)
        let buffer = [...basicInfo.documents];
        let result =[];
        buffer.map((doc) => { 
            if(!(doc.document_name === key))
            {
                result.push(doc)  
            } 
        });
        console.log(result);

        setBasicInfo((prev) => {
            let buffer = {...prev};
            buffer.documents=[...result]
            return buffer;
        });

    }


    return(
    <>
        <Modal isOpen={showPopup} containerClassName={styles.mainContainer}>

            <div className={styles.closePopup}>
                <div className={styles.topContainer}>

                    <div className={styles.title}>Upload Your Files</div>

                    <div className={styles.closeButton} onClick={() => setShowPopup(!showPopup)}><Icon iconName='ChromeClose'/></div>
                    
                </div>

                <div className={styles.message} onDragOver={handleDragover} onDrop={handleDrop} >

                <div className={styles.drop_file_container}>
                    {!isUploading && (<div className={styles.drop_file_text}>
                            <div><img src={dropfile} /></div> 
                            <div>Select your files to upload</div>
                    </div>)}

                    {isUploading && (<div className={styles.drop_file_text}>
                            <div><Spinner size={SpinnerSize.large}/></div> 
                            <br></br>
                            <div>Uploading...</div>
                    </div>)}
                    
                    {!isUploading && (<div>
                        <PrimaryButton onClick={() => inputRef.current.click()}>Browse</PrimaryButton> 
                        <input multiple hidden ref={inputRef} type='file' onChange={(e) => uploadDocs(e.target.files)}/>
                    </div>)}
                </div>

                

                </div>
                
                <div className={styles.bottomContainer}>
                    <div>
                        {basicInfo.documents.map((doc) => 
                        <div className={styles.spacer} >
                            <div><a href={doc.document}>{doc.document_name}</a></div>
                            <Icon iconName='ChromeClose' className={tableCloseIconClass} onClick={() => {removeUploadedDoc(doc.document_name)}}/>
                        </div>)}
                    </div>
                    
                    <div className={styles.buttonContainer}>
                        <PrimaryButton onClick={() => setShowPopup(!showPopup)}>Done</PrimaryButton>
                    </div>
                </div>
               
            </div>
        </Modal>
    </>
    )
}