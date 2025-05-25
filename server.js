const express = require("express");
const app = express();
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const server = http.createServer(app);

const io = socketIo(server)
dotenv.config();

const PORT = process.env.PORT;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("send-location", (location) => {
        io.emit("receive-location", { id: socket.id, ...location });
        console.log("Location received:", location);
    });

    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id);
        console.log("A user disconnected");
    });

})

app.get("/", (req, res) => {
    res.render("index");
})

server.listen(PORT,'0.0.0.0',()=> {

    console.log(`Server is running on http://localhost:${PORT}`);
})