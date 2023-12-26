// socket.js
const { Server } = require("socket.io");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: true,
  });

  let users = {};
  let socketToRoom = {};
  const maximum = 4;
 
  io.on("connection", (socket) => {
    console.log("Socket Connected", socket.id);
    //user join call
    socket.on("room:join", (data) => {
      try {
        if (!data.lobbyKey || !data.username) {
          throw new Error("Invalid data received for room:join");
        }
      
        if(users[data.lobbyKey]){
          const length = users[data.lobbyKey].length;
          if(length === maximum){
            socket.to(socket.id).emit("room_full");
            return;
          }
          users[data.lobbyKey].push({id:socket.id, uName: data.username});
        }else{
          users[data.lobbyKey] = [{id: socket.id, uName: data.username}];
        }
        socketToRoom[socket.id] = data.lobbyKey;
        socket.join(data.lobbyKey);
        const usersInThisRoom = users[data.lobbyKey].filter(user => user.id !== socket.id);
        console.log("userInthisroom",usersInThisRoom);
        console.log("socketROom",socketToRoom)

        io.sockets.to(socket.id).emit("user:join", usersInThisRoom);
      } catch (error) {
        console.error("Error in room:join event:", error.message);
      }
    });

    socket.on("offer", (data)=>{
      console.log("offer: " +socket.id);
      socket.broadcast.emit("getOffer",data)
    })
   
    socket.on("answer", (sdp) => {
      console.log("answer: " + socket.id);
      socket.broadcast.emit("getAnswer", sdp);
    });
  
    socket.on("candidate", (candidate) => {
      console.log("candidate: " + socket.id);
      socket.broadcast.emit("getCandidate", candidate);
    });
  
    socket.on("disconnect", () => {
      console.log(`[${socketToRoom[socket.id]}]: ${socket.id} exit`);
      const roomID = socketToRoom[socket.id];
      let room = users[roomID];
      if (room) {
        room = room.filter((user) => user.id !== socket.id);
        users[roomID] = room;
        if (room.length === 0) {
          delete users[roomID];
          return;
        }
      }
      socket.broadcast.to(room).emit("user_exit", { id: socket.id });
      console.log(users);
    });

  });
};

module.exports = { initSocket };
