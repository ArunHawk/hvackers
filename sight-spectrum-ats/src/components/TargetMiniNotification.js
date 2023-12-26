import React, { useState, useEffect } from 'react';



import { Dialog, DialogType, DialogFooter, PrimaryButton, DefaultButton, TextField, Stack, Check } from '@fluentui/react';
import styles from "../components/TargetMiniNotification.module.css";
import { ReactComponent as Check2} from "../assets/check.svg"
import { ReactComponent as Reject} from "../assets/cross.svg"
import { ReactComponent as Progress} from "../assets/progress.svg"
import { axiosPrivateCall } from "../constants";



const MyPopup = ({ Name,data, isOpen, onDismiss, sendToParent }) => {
  // const history = useHistory();

  
  const [updatedBy, setUpdatedBy] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    let base64Url = token.split(".")[1];
    let decodedValue = JSON.parse(window.atob(base64Url));
    console.log(decodedValue.user_id, "nul");
    setUpdatedBy(decodedValue.user_id); 
   
  }, []);
 



  const handleAcceptClick = async(obj) => {
    
const {assigned,isRead,updated_by,data}=obj

const datas={
  message:'accept',
  assigned,
  isRead: { read: 'false' },
  created_by:updated_by,
  updated_by:updatedBy,
  data
}

//  setUpdatedData(datas);
 postedData(datas)
 onDismiss()
  };
 
  const postedData=(updated)=>{
    try{
   axiosPrivateCall.post('api/v1/notification/sendNotification',updated).then(res=>console.log(res,'jjjjjjjjjjj'));

 
      }catch{
        console.log('error')
      }
  }
  const handleRejectClick = (obj) => {
    const {assigned,isRead,updated_by,data}=obj
    const datas={
      message: 'reject',
      assigned,
      isRead: { read: 'false' },
      created_by:updated_by,
      updated_by:updatedBy,
      data
    }
    //  setUpdatedData(datas);
     postedData(datas)
     onDismiss()
  };

  const handleReviewClick = (obj) => {

    sendToParent('review',obj.assigned);
    onDismiss()
  
  }
  return (   
     
    <Dialog
      hidden={!isOpen}
      onDismiss={onDismiss}
      dialogContentProps={{
        type: DialogType.close,
        title: `${Name} requested to change the target`,
        data:data
      }}
      modalProps={{
        isBlocking: false,
        containerClassName: 'ms-dialogMainOverride',
        styles: { main: 
        { minWidth: '400px !important',
        boxShadow:'0px 0px 10px 5px #888888',
        
        // height: '700px' 
       } },
      }}
     
    >
     { data.data&&data.data.length > 0 && data.data.map(obj => (
      <div key={obj._id}>
<Stack horizontal>

  <div className={`${styles.labelInputContainer}`}>
    <p>Target</p>
  
    <TextField
      value={obj.target}
      // onChange={(e, newValue) => setInput1Value(newValue)}
      borderless={true}
      className={styles.inputStyle}

    />
  </div>
  <div className={`${styles.labelInputContainer}`}>
  <p>FullTime</p>
    <TextField
      value={obj.fulltime}
      // onChange={(e, newValue) => setInput2Value(newValue)}
      borderless={true}
      className={styles.inputStyle}

    />
  </div>
</Stack>

<Stack horizontal>
  <div className={`${styles.labelInputContainer1}`}>
    <p>Contract</p>
    <TextField
      value={obj.contract}
      // onChange={(e, newValue) => setInput3Value(newValue)}
      borderless={true}
      className={styles.inputStyle}
    />

  </div>
  <div className={`${styles.labelInputContainer}`}>
    <p>Revenue</p>
    <TextField
      value={obj.revenue}
      // onChange={(e, newValue) => setInput4Value(newValue)}
      borderless={true}
      className={styles.inputStyle}
    />
  </div>
</Stack>



      <DialogFooter>
       

        <div className={styles.buttonContainer}>
   
    <button className={styles.acceptButton} onClick={()=>handleAcceptClick(data)}>
      <Check2 /> Accept
    </button>
    <button className={styles.reviewButton} onClick={()=>handleReviewClick(data)}>
      <Progress /> Review
    </button>
    <button className={styles.rejectButton} onClick={()=>handleRejectClick(data)}>
      <Reject /> Reject
    </button>
  </div>
      </DialogFooter>
      </div> 
      ))}
    </Dialog>
    
  );
};

export default MyPopup;