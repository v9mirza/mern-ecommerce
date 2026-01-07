const User = require("../models/User");

const admin = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (user && user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
};

module.exports = admin;
