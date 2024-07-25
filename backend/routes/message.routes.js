const { Router } = require("express");
const {
  sendMessage,
  allMessages,
} = require("../controllers/message.controller");

const messageRouter = Router();

messageRouter.post("/", sendMessage);

messageRouter.get("/:chatId", allMessages);

module.exports = { messageRouter };
