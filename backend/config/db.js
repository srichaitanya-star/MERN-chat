const mongoose = require("mongoose");
//require("dotenv").config();

const connection = mongoose.connect("mongodb+srv://allaajay9933:M3i77waFicF3u7Wz@mongodb.acmejcm.mongodb.net/chats?retryWrites=true&w=majority");

module.exports = {
  connection
};
