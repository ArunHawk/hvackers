import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import JSZip from 'jszip';
import axios from 'axios';
import './home.css';

const Home = () => {
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [videoChunks, setVideoChunks] = useState([]);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [localVideo, setLocalVideo] = useState(null);
  const localVideoRef = useRef(null);
  const mimeType = "video/webm";

  const getCameraPermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const videoStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        setPermission(true);
        setStream(videoStream);
        setAudioStream(audioStream);
        localVideoRef.current.srcObject = videoStream;
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const startRecording = () => {
    setRecordingStatus("recording");
    const mediaTracks = [...stream.getTracks(), ...audioStream.getTracks()];
    const mediaStream = new MediaStream(mediaTracks);
    const mediaRecorderInstance = new MediaRecorder(mediaStream, { mimeType });
    mediaRecorder.current = mediaRecorderInstance;
    const localVideoChunks = [];
  
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localVideoChunks.push(event.data);
    };
  
    mediaRecorder.current.start();
    setVideoChunks(localVideoChunks);
  };
  

  const stopRecording = async () => {
    setPermission(false);
    setRecordingStatus("inactive");
    mediaRecorder.current.stop();

    mediaRecorder.current.onstop = async () => {
      const videoBlob = new Blob(videoChunks, { type: mimeType });
      const zip = new JSZip();

      // Zip Work
      zip.file('recordedVideo.webm', videoBlob);

      const lcVideo = URL.createObjectURL(videoBlob);
      const zipBlob = await zip.generateAsync({ type: 'blob' });

      const formData = new FormData();
      formData.append('file', zipBlob);

      try {
        const response = await axios.post("http://localhost:8000/api/v1/uploadVideo", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log(response);
      } catch (err) {
        console.error(err);
      }

      setRecordedVideo(lcVideo);
      setLocalVideo(lcVideo);
      setVideoChunks([]);
    };
  };

  console.log(recordedVideo, "rec");

  return (
    <div className='homeContainer'>
      <Link to="/login">Login</Link>
      <Link to="/signup">Register</Link>
      <h1>Hello worlds</h1>
      <video ref={localVideoRef} autoPlay width="300px" height="300px" />
      <div className="video-controls">
        {!permission ? (
          <button onClick={getCameraPermission} type="button">
            Get Camera
          </button>
        ) : null}
      </div>
      {permission && recordingStatus === "inactive" ? (
        <button onClick={startRecording} type="button">
          Start Recording
        </button>
      ) : null}
      {recordingStatus === "recording" ? (
        <button onClick={stopRecording} type="button">
          Stop Recording
        </button>
      ) : null}
      {stream ? (
        <div className="audio-player">
          <video src={localVideo} controls />
          <a download href={recordedVideo}>
            Download Recording
          </a>
        </div>
      ) : null}
    </div>
  );
};

export default Home;
