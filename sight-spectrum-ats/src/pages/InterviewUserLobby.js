import { DefaultButton, TextField } from '@fluentui/react'
import React, { useCallback, useState } from 'react'
import './interviewUserLobby.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSocket } from '../components/providers/SocketProvider';


const InterviewUserLobby = () => {

  const navigate = useNavigate();
  const socket = useSocket();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const lobbyKey = queryParams.get('hs');
  const [username,setUserName] = useState("");
  

  console.log(lobbyKey)
  

  const handleJoinRoom =useCallback((e)=>{
    e.preventDefault();
    socket.emit("room:join",{lobbyKey,username})
    console.log(lobbyKey,username)
    if(lobbyKey !== null){
      navigate(`/interview/${lobbyKey}`)
    }
  },[socket,navigate,lobbyKey,username])


  return (
    <div className='lobbyConatiner'>
      <label>Name</label>
      <TextField
      name='name'
      type='text'
      onChange={(e)=>{setUserName(e.target.value)}}
      />
     
      <DefaultButton
      text='Join Meet'
      primary
      onClick={handleJoinRoom}
      />
    </div>
  )
}

export default InterviewUserLobby