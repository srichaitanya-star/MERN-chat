const express = require("express");
const { chats } = require("./data/data");
const cors = require("cors");
const { connection } = require("./config/db");
const colors = require("colors");
const { UserRouter } = require("./routes/user.routes");
const { authentication } = require("./middlewares/authentication");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const { ChatsRouter } = require("./routes/chats.routes");
const { messageRouter } = require("./routes/message.routes");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("This is the Home page");
});

app.use("/user", UserRouter);

app.use(authentication);

app.use("/chats", ChatsRouter);

app.use("/message", messageRouter);

app.use(notFound);

app.use(errorHandler);

const server = app.listen(PORT, async () => {
  try {
    await connection;
    console.log(
      `MongoDB Connected: ${(await connection).connection.host}`.cyan.underline
    );
  } catch (err) {
    console.log(err);
    console.log(`Error: ${err.message}`.red.bold);
  }
  console.log(`Server is listening on PORT ${PORT}`.cyan.bold);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: PORT,
  },
});

// io.set('origins', '*:*');

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  io.set('origins', '*:*');
  
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined the Room:" + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    // console.log(chat);

    if (!chat.users) return console.log("Chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
