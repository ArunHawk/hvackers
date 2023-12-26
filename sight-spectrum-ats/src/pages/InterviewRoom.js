import React, { useCallback, useEffect,useRef} from 'react'
import { useSocket } from '../components/providers/SocketProvider'
import styles from './interviewRoom.module.css';
import Peer from '../components/providers/Peer';

const InterviewRoom = () => {
  const socket = useSocket();
  const localVideo = useRef();
  const remoteVideo = useRef();
   

  const createOffer = useCallback(async () =>{
    console.log("create Offer");
    if(!(Peer.peer && socket)) return;
    try{
      const sdp = await Peer.peer.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await Peer.peer.setLocalDescription(new RTCSessionDescription(sdp));
      socket.emit("offer",sdp);
      console.log("sdp",sdp)
    } catch (err){
      console.error(err);
    }
  },[socket])

  const createAnswers = useCallback(async (sdp)=>{
    if(!(Peer.peer && socket)) return;
    try{
      await Peer.peer.setRemoteDescription(new RTCSessionDescription(sdp));
      console.log("answer set remote description success");
      const mySdp = await Peer.peer.createAnswer({
        offerToReceiveVideo: true,
        offerToReceiveAudio: true,
      });
      console.log("create answer");
      await Peer.peer.setLocalDescription(new RTCSessionDescription(mySdp));
      socket.emit("answer",mySdp)
    }catch(err){
      console.error(err)
    }

  },[socket])
  const getUserMedia = useCallback( async (data)=>{
    try{
      const constraints = {
      audio:false,
      video: true,
    }
    console.log("userMediaCall",data)
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    localVideo.current.srcObject = stream;

    stream.getTracks().forEach((track) =>{
      if(!Peer.peer) return;
      Peer.peer.addTrack(track,stream);
    });
    Peer.peer.onicecandidate =(e)=>{
      if(e.candidate){
        if(!socket) return;
        console.log("onIceCandidate");
        socket.emit("candidate", e.candidate);
      }
    };
    Peer.peer.oniceconnectionstatechange =(e)=>{
      console.log(e)
    }

    Peer.peer.ontrack = (e)=>{
      console.log("Add Remote track Success");
      if(remoteVideo.current){
        remoteVideo.current.srcObject = e.streams[0];
      }
    }

    createOffer();
    }catch(err){
      console.log("GetuserMedia Error : ",err)
    }

  },[createOffer,socket])

  const handleGetOffer = useCallback((sdp)=>{
    console.log("get offer")
    createAnswers(sdp)
  },[createAnswers])
 
  const handleUserAnswer = useCallback((data)=>{
    console.log("get Answer")
    if(!Peer.peer) return;
    Peer.peer.setRemoteDescription(new RTCSessionDescription(data))
    console.log("handleUserAnswer",data)
  },[])

  const handleCandidate = useCallback(async (candidate)=>{
    console.log("handlecandidate")
    if(!Peer.peer) return;
    await Peer.peer.addIceCandidate(new RTCIceCandidate(candidate));
    console.log("candidate add success");
  },[])

  useEffect(()=>{
    socket.on("user:join",getUserMedia);
    socket.on("getOffer",handleGetOffer);
    socket.on("getAnswer",handleUserAnswer);
    socket.on("getCandidate",handleCandidate);
    return()=>{
      socket.off("user:join",getUserMedia);
      socket.off("getOffer",handleGetOffer);
      socket.off("getAnswer",handleUserAnswer);
      socket.off("getCandidate",handleCandidate);
      if (socket){
        socket.disconnect();
      }
      if(Peer.peer){
        Peer.peer.close();
      }
    }
  },[socket,getUserMedia,handleGetOffer,handleUserAnswer,handleCandidate])
  
  
  
  return (
    <div className={styles.RoomContainer}>
      <h1>SpectrO Call</h1>
      <video ref={localVideo} autoPlay width="300px" height="500px"></video>
      <video ref={remoteVideo} autoPlay width="300px" height="500px"></video>
    </div>
  )
}

export default InterviewRoom