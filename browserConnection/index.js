// see https://socket.io/
import { Server } from "socket.io";

const io = new Server({cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }});


var broadcastRoomName = "1880broadcast";


io.on("connection", (socket) => {
	console.log(socket.id);
	socket.join(broadcastRoomName);
    socket.on("private message", (msg) => {
    	console.log("got message " + msg );
    	socket.emit("tell you", "thanks for that");
//      socket.to(anotherSocketId).emit("private message", socket.id, msg);
    });	
  // ...
});

io.listen(9003);



