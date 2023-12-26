class PeerService {
    constructor() {
      if (!this.peer) {
        this.peer = new RTCPeerConnection({
          iceServers: [
            {
              urls: [
                "stun:stun.l.google.com:19302",
                "stun:stun.services.mozilla.com",
                "stun:global.stun.twilio.com:3478",
              ],
            },
          ],
        });
      }
    }
   
    async setLocalDescription(ans) {
      if (this.peer) {
        try {
          await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
        } catch (error) {
          console.error("Error setting remote description:", error);
          throw error;
        }
      }
    }
  
   
  }
  
  export default new PeerService();
  