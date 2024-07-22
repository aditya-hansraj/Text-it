const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:5173/" });

let onlineUsers = [];

io.on("connection", socket => {
  console.log(`New Connection from client !\n'socketId': '${socket.id}'`);

  //listening to a connection
  socket.on("addNewUser", userId => {
    !onlineUsers.some(user => user.userId == userId) &&
        onlineUsers.push({
            userId,
            socketId: socket.id
        });
    console.log('Online Users:', onlineUsers);

    io.emit('getOnlineUsers', onlineUsers);
  });

  // add message
  socket.on("sendMessage", msg => {
    const user = onlineUsers.find(usr => usr.userId == msg.recipientId);
    if(user) {
        io.to(user.socketId).emit("getMessage", msg)
    }
  });

  //disconnecting a user 
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter(user => user.socketId != socket.id);
    io.emit('getOnlineUsers', onlineUsers);
  })
});

// Socket Port (different from client & server)
io.listen(3000);