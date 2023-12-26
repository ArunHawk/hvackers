import React, { useCallback, useEffect,useRef, useState} from 'react'
import { useSocket } from '../components/providers/SocketProvider'
import styles from './interviewRoom.module.css';
import Peer from '../components/providers/Peer';

// Import Video component and WebRTCUser type
const Video = require('./Components/Video');



// Define the App component
function InterviewRoom() {
  const socketRef = useSocket();
  const pcsRef = useRef({});
  const localVideoRef = useRef();
  const localStreamRef = useRef();
  const [users, setUsers] = useState([]);

  const getLocalStream = useCallback(async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: 240,
          height: 240,
        },
      });
      localStreamRef.current = localStream;
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
      if (!socketRef) return;
      socketRef.emit('join_room', {
        lobbyKey: '1234',
        username: 'sample@naver.com',
      });
    } catch (e) {
      console.log(`getUserMedia error: ${e}`);
    }
  }, []);

  const createPeerConnection = useCallback((socketID, uName) => {
    try {
      const pc = Peer.Peer;

      pc.onicecandidate = (e) => {
        if (!(socketRef && e.candidate)) return;
        console.log('onicecandidate');
        socketRef.emit('candidate', {
          candidate: e.candidate,
          candidateSendID: socketRef.id,
          candidateReceiveID: socketID,
        });
      };

      pc.oniceconnectionstatechange = (e) => {
        console.log(e);
      };

      pc.ontrack = (e) => {
        console.log('ontrack success');
        setUsers((oldUsers) =>
          oldUsers
            .filter((user) => user.id !== socketID)
            .concat({
              id: socketID,
              uName,
              stream: e.streams[0],
            })
        );
      };

      if (localStreamRef.current) {
        console.log('localstream add');
        localStreamRef.current.getTracks().forEach((track) => {
          if (!localStreamRef.current) return;
          pc.addTrack(track, localStreamRef.current);
        });
      } else {
        console.log('no local stream');
      }

      return pc;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }, []);

  useEffect(() => {
    
    getLocalStream();

    socketRef.on('all_users', (allUsers) => {
      allUsers.forEach(async (user) => {
        if (!localStreamRef.current) return;
        const pc = createPeerConnection(user.id, user.uName);
        if (!(pc && socketRef)) return;
        pcsRef.current = { ...pcsRef.current, [user.id]: pc };
        try {
          const localSdp = await pc.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          });
          console.log('create offer success');
          await pc.setLocalDescription(new RTCSessionDescription(localSdp));
          socketRef.emit('offer', {
            sdp: localSdp,
            offerSendID: socketRef.id,
            offerSendEmail: 'offerSendSample@sample.com',
            offerReceiveID: user.id,
          });
        } catch (e) {
          console.error(e);
        }
      });
    });

    socketRef.on('getOffer', async (data) => {
      const { sdp, offerSendID, offerSendEmail } = data;
      console.log('get offer');
      if (!localStreamRef.current) return;
      const pc = createPeerConnection(offerSendID, offerSendEmail);
      if (!(pc && socketRef)) return;
      pcsRef.current = { ...pcsRef.current, [offerSendID]: pc };
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        console.log('answer set remote description success');
        const localSdp = await pc.createAnswer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true,
        });
        await pc.setLocalDescription(new RTCSessionDescription(localSdp));
        socketRef.emit('answer', {
          sdp: localSdp,
          answerSendID: socketRef.id,
          answerReceiveID: offerSendID,
        });
      } catch (e) {
        console.error(e);
      }
    });

    socketRef.on('getAnswer', (data) => {
      const { sdp, answerSendID } = data;
      console.log('get answer');
      const pc = pcsRef.current[answerSendID];
      if (!pc) return;
      pc.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socketRef.on('getCandidate', async (data) => {
      console.log('get candidate');
      const pc = pcsRef.current[data.candidateSendID];
      if (!pc) return;
      await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      console.log('candidate add success');
    });

    socketRef.on('user_exit', (data) => {
      if (!pcsRef.current[data.id]) return;
      pcsRef.current[data.id].close();
      delete pcsRef.current[data.id];
      setUsers((oldUsers) => oldUsers.filter((user) => user.id !== data.id));
    });

    return () => {
      if (socketRef) {
        socketRef.disconnect();
      }
      users.forEach((user) => {
        if (!pcsRef.current[user.id]) return;
        pcsRef.current[user.id].close();
        delete pcsRef.current[user.id];
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createPeerConnection, getLocalStream]);

  return (
    <div>
      <video
        style={{
          width: 240,
          height: 240,
          margin: 5,
          backgroundColor: 'black',
        }}
        muted
        ref={localVideoRef}
        autoPlay
      />
      {users.map((user, index) => (
        <Video key={index} email={user.email} stream={user.stream} />
      ))}
    </div>
  );
}

// Export the App component as the default export of this module
module.exports = InterviewRoom;
