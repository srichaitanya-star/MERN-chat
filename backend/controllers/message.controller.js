const { ChatModel } = require("../models/chat.model");
const { MessageModel } = require("../models/message.model");
const { UserModel } = require("../models/user.model");

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    res.status(400).send("Invalid Data");
  }

  // var newMessage = {
  //   sender: req.user._id,
  //   content: content,
  //   chat: chatId,
  // };

  const newMessage = new MessageModel({
    sender: req.user._id,
    content: content,
    chat: chatId,
  });

  try {
    const message = await newMessage.save();
    await message.populate("sender", "name pic");
    await message.populate("chat");

    await UserModel.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await ChatModel.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.send(message);
  } catch (err) {
    res.status(400).send(err);
  }
};

const allMessages = async (req, res) => {
  // const {} = req.body;

  try {
    const messages = await MessageModel.find({
      chat: req.params.chatId,
    }).populate("sender", "name pic email");
    // .populate("users");

    res.send(messages);
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = { sendMessage, allMessages };
