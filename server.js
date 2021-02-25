
const express = require("express");
var cors = require("cors");
const app = express();
const path = require("path");
const port = 3000;


app.use(cors());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// viewed at http://localhost:3000

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});


app.use(express.static(path.join(__dirname, "/public")));



const server = app.listen(port, () => {
  console.log("Listening on port: " + port);
});
const io = require("socket.io")(server);

io.on("connection", function (socket) {


  socket.on("sendLines", (target, amount) => {
      io.emit("receiveLines", target, amount)
  });
  socket.on("sendBoard", (data) => {
      io.emit("receiveBoard", socket.id, data)
  })
  
  socket.on("sendPieceData", ( data) => {
      io.emit("receivePieceData", socket.id, data)
  })
  socket.on("disconnect", () => {
      io.emit("removePlayer", socket.id)
  })
});
