// // controllers/superAdmin.controller.js
// const User = require("../models/User");
// const ActivityLog = require("../models/ActivityLog");

// exports.createAdmin = async (req, res) => {
//   const { name, email, password } = req.body;

//   const admin = await User.create({
//     name,
//     email,
//     password,
//     role: "admin"
//   });

//   await ActivityLog.create({
//     actor: req.user.id,
//     action: "Created admin",
//     targetUser: admin._id
//   });

//   res.status(201).json(admin);
// };

// exports.blockUser = async (req, res) => {
//   const user = await User.findByIdAndUpdate(
//     req.params.id,
//     { isBlocked: true },
//     { new: true }
//   );

//   await ActivityLog.create({
//     actor: req.user.id,
//     action: "Blocked user",
//     targetUser: user._id
//   });

//   res.json(user);
// };

// exports.unblockUser = async (req, res) => {
//   const user = await User.findByIdAndUpdate(
//     req.params.id,
//     { isBlocked: false },
//     { new: true }
//   );

//   res.json(user);
// };

// exports.deleteUser = async (req, res) => {
//   await User.findByIdAndDelete(req.params.id);

//   await ActivityLog.create({
//     actor: req.user.id,
//     action: "Deleted user",
//     targetUser: req.params.id
//   });

//   res.json({ message: "User deleted permanently" });
// };