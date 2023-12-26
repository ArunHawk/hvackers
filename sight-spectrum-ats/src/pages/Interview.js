import { DefaultButton, mergeStyles } from '@fluentui/react'
import React, { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { videoCallApi } from '../constants';
import { TextField } from '@fluentui/react/lib/TextField';
import styles from './interview.module.css'
import { useSocket } from '../components/providers/SocketProvider';

const menuProps = {
  items: [
    {
      key: 'Schedule Meeting',
      text: 'Schedule Meeting',
    },
    {
      key: 'Start Instant Meeting',
      text: 'Start Instant Meeting',
    },
  ],
};

const callLink = mergeStyles({
  width:300,
  height:12,
  color:"#999DA0"
})



export default function Interview() {

  const [videoLink,setVideoLink] = useState("");
  const [lobbyKey,setLobbyKey] = useState(null);
  const [username,setUserName] = useState("");
  const textFieldRef = useRef(null);
  const navigate = useNavigate();
  const socket = useSocket();
  
  const handleCopyClick = () => {
    // Check if the text field is available
    if (textFieldRef.current) {
      // Select the text inside the text field
      textFieldRef.current.select();
      // Execute the copy command
      document.execCommand('copy');
    }
  };

  const copyIcon = {
    iconName: 'Copy',
    onClick: handleCopyClick,
    styles: {
      icon: {
        fontSize: '12px',
      },
    },
  };

  const generateSecretKey = () => {
    const array = new Uint8Array(4);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  const handleMenuItemClick = (ev, item) => {
    if(item.key === "Start Instant Meeting"){
      const secretKey = generateSecretKey();
      const vLink = `${videoCallApi.baseURL}/lobby?hs=${secretKey}`
      console.log(`${videoCallApi.baseURL}/lobby?hs=${secretKey}`)
      setVideoLink(vLink)
      setLobbyKey(secretKey)
    }
    else if(item.key === "Schedule Meeting"){
      const secretKey = generateSecretKey();
      const vLink = `${videoCallApi.baseURL}/lobby?hs=${secretKey}`
      console.log(`${videoCallApi.baseURL}/lobby?hs=${secretKey}`)
      setVideoLink(vLink)
      setLobbyKey(secretKey)
    }
  };
  const handleJoinRoom =useCallback((e)=>{
    e.preventDefault();
    socket.emit("room:join",{lobbyKey,username})
    if(lobbyKey !== null){
      navigate(`/interview/${lobbyKey}`)
    }
  },[socket,lobbyKey,navigate,username])

  
  
 
  return (
    <div className={styles.intContainer}>
      <div className={styles.newMeet}>
      <DefaultButton
        text="New Meeting"
        primary
        menuProps={{
          ...menuProps,
          onItemClick: handleMenuItemClick,
        }}
        />
        </div>
        <div className={styles.textLink}>

      <TextField 
      label='Call Link'
      className={callLink}
      value={videoLink}
      componentRef={textFieldRef}
      readOnly // Set to readOnly to prevent editing
      onRenderSuffix={() => <DefaultButton iconProps={copyIcon} />}
      />
      </div>
      <div className={styles.joinButton}>
      <DefaultButton
      text='Join Meet'
      primary
      label='Join'
      onClick={handleJoinRoom}
      />
      </div>
      <div>
        <TextField
        label='Name'
        onChange={(e)=>{setUserName(e.target.value)}}
        />
      </div>
    </div>
  )
}
