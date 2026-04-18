const User = require("../models/User");

exports.requireSuperAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    // Optional: fetch fresh user from DB
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        message: "Account is blocked"
      });
    }

    if (user.role !== "superadmin") {
      return res.status(403).json({
        message: "Access denied. Super Admin only."
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};