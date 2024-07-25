const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");
require("dotenv").config();

const authentication = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_KEY);
      req.user = await UserModel.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      console.log(err);
      res.status(401).send({ message: "Not authorized" });
    }
  }
  if (!token) {
    res.status(401).send({ message: "Not authorized, no token" });
  }
};

module.exports = { authentication };
