const { Router } = require("express");
const {
  RegisterUser,
  loginUser,
  allUsers,
} = require("../controllers/user.controller");
const { authentication } = require("../middlewares/authentication");

const UserRouter = Router();

UserRouter.post("/signup", RegisterUser);
UserRouter.post("/login", loginUser);
UserRouter.get("/allUser", authentication, allUsers);

module.exports = {
  UserRouter,
};
