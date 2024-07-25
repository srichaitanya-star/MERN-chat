const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, {
    expiresIn: "30d",
  });
};

// const verifyToken = (token) => {
//   return jwt.verify({ token }, process.env.JWT_KEY);
// };

module.exports = {
  generateToken,
  // verifyToken,
};
