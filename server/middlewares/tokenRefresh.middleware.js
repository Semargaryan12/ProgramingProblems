// const jwt = require("jsonwebtoken");
// const RefreshToken = require("../models/RefreshToken");

// exports.verifyRefreshToken = async (req, res, next) => {
//   const { refreshToken } = req.body;

//   if (!refreshToken) {
//     return res.status(401).json({ message: "Refresh token required" });
//   }

//   try {
//     const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

//     const storedToken = await RefreshToken.findOne({ token: refreshToken });

//     if (!storedToken) {
//       return res.status(403).json({ message: "Invalid refresh token" });
//     }

//     req.user = decoded;
//     next();
//   } catch {
//     return res.status(403).json({ message: "Expired refresh token" });
//   }
// };