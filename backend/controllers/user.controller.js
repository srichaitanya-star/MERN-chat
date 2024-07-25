const { generateToken } = require("../config/GenerateToken");
const { UserModel } = require("../models/user.model");
const bcrypt = require("bcrypt");

const RegisterUser = async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400).send({ message: "Please Enter all the Credentials" });
    // throw new Error("Please Enter all the Credentials");
  }

  const userExists = await UserModel.findOne({ email });

  if (userExists) {
    res.status(400).send({ message: "User already Exists" });
    // throw new Error("User already Exists");
  } else {
    bcrypt.hash(password, 6, async function (err, hash) {
      if (err) {
        res.status(400).send({ message: "Something went wrong" });
        // throw new Error("Something went wrong");
      }
      const user = new UserModel({
        name,
        email,
        password: hash,
        pic,
      });

      if (user) {
        await user.save();
        res.status(201).send({
          _id: user._id,
          name: user.name,
          email: user.email,
          pic: user.pic,
          token: generateToken(user._id),
        });
      } else {
        res.status(400).send({ message: "Failed to create the User" });
        // throw new Error("Failed to create the User");
      }
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (user) {
    const hash = user.password;
    bcrypt.compare(password, hash, function (err, result) {
      if (err) {
        console.log(err);
        res.status(401).send(err);
      }

      if (result) {
        res.status(201).send({
          _id: user._id,
          name: user.name,
          email: user.email,
          pic: user.pic,
          token: generateToken(user._id),
        });
      } else {
        res
          .status(400)
          .send({ message: "Wrong credentials, Please try again" });
        // throw new Error("Wrong credentials, Please try again");
      }
    });
  } else {
    res.status(400).send({ message: "User doesn't Exist" });

    // throw new Error("User doesn't Exist");
  }
};

const allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          {
            name: { $regex: req.query.search, $options: "i" },
          },
          {
            email: { $regex: req.query.search, $options: "i" },
          },
        ],
    }
    : {};
  const users = await UserModel.find(keyword).find({
    _id: { $ne: req.user._id },
  });
  res.send(users);
};

module.exports = {
  RegisterUser,
  loginUser,
  allUsers,
};
