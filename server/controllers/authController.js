const Users = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!(username && password))
      return res.status(400).json({ message: "Field can't be empty" });
    const user = await Users.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const token = jwt.sign({ _id: user._id }, "iugiuvhgeliuvgeiuvgfeuvgeivg");
      res.header("x-auth-token", token);
      return res.status(200).json({ message: "Success" });
    }
    res.status(401).json({ message: "Invalid Password" });
  } catch (err) {
    return res.status(401).json({ message: ` ${err}` });
  }
};
const signup = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!(username && password))
     return res.status(400).json({ message: "Field can't be empty" });
     const isValidPassword = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#%])/.test(password);
     if(!isValidPassword)  
     throw new Error("Password must contain at least one uppercase,lower case and one special character");
    const user = new Users({ username, password });
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    const token = jwt.sign({ _id: user._id }, "iugiuvhgeliuvgeiuvgfeuvgeivg");
    res.header("x-auth-token", token);
    res.json({ message: "User registered successfully" });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ message: "User already exist" });
    res.status(400).json({ message: "" + err });
  }
};
module.exports = { login, signup };
