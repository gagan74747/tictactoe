const jwt = require('jsonwebtoken');
const User = require('../models/user');

async function Authenticate(req, res, next) {
  try {
    if (req.headers.token==='null') {
      res.status(307).json({ message: 'redirect' });
      return;
    }
    const { token } = req.headers;
    const verifytoken = jwt.verify(token, 'iugiuvhgeliuvgeiuvgfeuvgeivg');
    const rootuser = await User.findOne({ _id: verifytoken._id });
    if (!rootuser) { throw new Error('redirect'); }
    req.username= rootuser.username;
    req.user_id = rootuser._id;
    next();
  } catch (err) {
    res.status(307).json({ message: 'redirect' });
  }
}
module.exports = Authenticate;
