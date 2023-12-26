import React, { useEffect, useState,createContext } from 'react';
import { Stack, DefaultButton, Dropdown, Popup, Icon, PrimaryButton } from '@fluentui/react';
import styles from "../components/TargetNotification.module.css";
import MyPopup from "../components/TargetMiniNotification";
import { axiosPrivateCall } from "../constants";


const Notification = ({ title, content, status, openPopup ,data}) => {
  const token = localStorage.getItem("token");
  let base64Url = token.split(".")[1];
  let decodedValue = JSON.parse(window.atob(base64Url));

  const getStatusColor = () => {
    switch (status) {
      case 'Accepted':
        return '#08c708';
      case 'Rejected':
        return '#ffdfdd';
      case 'Reviewed':
        return '#d9d9d9';
      case 'Requested':
        return '#ffb84c';
     default:
        return '#d9d9d9';
    }
  };

  const bulletStyle = {
    width: '8px',
    height: '8px',
    backgroundColor: getStatusColor(),
    borderRadius: '50%',
    marginRight: '8px',
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [hasExpandedOnce, setHasExpandedOnce] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);

    if (!hasExpandedOnce) {
      setHasExpandedOnce(true);
    }


 let user={ isRead:
   {
  id: decodedValue.userId,
  read: "true"
}
 }
   axiosPrivateCall.put(`api/v1/notification/readNotification/${data.updatedId}`,user).then(res=>{
    }).then(err=> console.log('updated'))

    if (status === 'Requested') {
      openPopup(title,data);
    }
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={bulletStyle}></div>
        <div>
          <strong style={{ color: hasExpandedOnce || isExpanded || (data.isRead.read === 'true')? 'gray' : 'black' }}>{title}</strong>
        </div>
        <Icon
          iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          onClick={toggleExpand}
          style={{ marginLeft: 'auto', cursor: 'pointer' }}
        />
      </div>
      {isExpanded ? <p style={{ color: 'gray' }}>{content}</p> : null}
    </div>
  );  
};



const NotificationsBox = ({ isOpen, onDismiss,targetId ,data,sendToParent}) => {


  const token = localStorage.getItem("token");
  let base64Url = token.split(".")[1];
  let decodedValue = JSON.parse(window.atob(base64Url));
  const [userId, setUserId] = useState(decodedValue.user_id);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [updatedData,setUpdatedData]=useState([])
  const [notifications, setNotifications] = useState([]);

  useEffect(()=>{
    axiosPrivateCall.get(`api/v1/notification/getNotification/${userId}`).then(
      (res)=>{
        if(res.data.length>0&&res.data!==undefined){
        
          const notifications =res.data
        
          .filter((target) => {
            return target.message !== undefined && target.message !== null && target.message.trim() !== '';
          })
          .map((target, index) => {
           
            const message = target.message;
            let status, title, content;
            target.data.map(i=>
           {
            const targetName=target&&target.updated_by?`${target.updated_by.first_name} `:''
           let userName=targetName;
           
            switch (message) {
              case 'request':
                status = 'Requested';
                title = `${userName} Requested to change target`;
                content=' ';
                break;
              case 'accept':
                status = 'Accepted';
                title = `${userName} Accepted the target`;
                content=`${userName} Accepted the target and start working towards it `;
                break;
              case 'review':
                status = 'Reviewed';
                title = `${userName} Reviewed the target`;
                content=`${userName} Reviewed your target,Kindly check and start working towards it`;
                break;
              case 'reject':
                status = 'Rejected';
                title = `${userName} Rejected the target`;
                content=`There is no any possibilities to change the target So Kindly start working on it.`;
             
                break;
              default:
                status = 'Unknown';
                title = 'Unknown Notification';
            }
          })
         console.log( {
           content,status,title
       
           },'ddddddddddddddddddddddddddddd');
            return {
             assigned: target.assigned, // Add the target._id to associate with the card
              title,
              content,
              status,
             created_by:target.created_by,
             updated_by:target.updated_by,
              isRead:target.isRead,
              data:target.data,
              updatedId:target._id
        
            };
          });
        console.log(notifications,'llllllllllllllllllllllll')
       
          const filteredNotifications = notifications.filter((notification) =>{
    
          
            if(userId==='641451d847038cf77ecc7cf7'){
              return notification.assigned===targetId&&( "6414487f47038cf77ecc7c46"===notification.updated_by._id || "641451d847038cf77ecc7cf7"===notification.updated_by._id|| notification.created_by===userId)
            }else{
              return notification.assigned===targetId&&( "6414487f47038cf77ecc7c46"===userId || notification.created_by===userId)
            }
           
           
            
          });

      
          return  setNotifications(filteredNotifications);
        }
        
      }
    ).catch(err=>{
      console.log(err)
    })
     
  },[])


  const openPopup = (title,data) => {
    setPopupTitle(title.split(' ')[0]);
    setUpdatedData(data)
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  }
 




  return (
    <Popup
      isOpen={isOpen}
      onDismiss={onDismiss}
      contentContainerProps={{ style: { padding: '20px' } }}
      offsetX={10}
      offsetY={10}

      position={{ target: 'auto', element: 'auto' }}
      className={styles.notificationboxcontainer}
    >
      <div  className={styles.popup1} >
        <h3>Notifications</h3>
        {/* <input type="button" value="X" onClick={onDismiss} style={{fontSize:'22.8px',display:'flex', textDecoration:'none',}}/> */}
        <div className={styles.btnCon}>
        <Icon iconName='ChromeClose' onClick={onDismiss} className={styles.closeBtn}/>
        </div>
      </div>
      <Stack tokens={{ childrenGap: 25 }} className={styles.stacks}>
    
        {notifications.length === 0 ? ( // Check if the array is empty
          <div>No Notifications</div>
        ) : (
          // If not empty, map and render notifications
          notifications.map((notification, index) => (
            <div key={index}>
              <Notification
                key={index}
                title={notification.title}
                content={notification.content}
                status={notification.status}
                data={notification}
                openPopup={openPopup}
              />
              <hr></hr>
            </div>
          ))
        )}
      </Stack>
      <MyPopup Name={popupTitle} data={updatedData} isOpen={isPopupOpen}  sendToParent={sendToParent} onDismiss={closePopup} />
    </Popup>
  );
};

export default NotificationsBox;