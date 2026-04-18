// middleware/authAdmin.js
module.exports = (req, res, next) => {
  // JWT-ից հանված admin
  req.admin = {
    id: req.user.id,
  };
  next();
};
