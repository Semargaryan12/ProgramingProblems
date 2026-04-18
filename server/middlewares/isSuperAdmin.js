// Middleware ստուգելու համար արդյոք օգտատերը SuperAdmin է
const isSuperAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'superadmin') {
        next();
    } else {
        res.status(403).json({ message: "Մուտքը արգելված է: Միայն SuperAdmin-ների համար" });
    }
};

module.exports = isSuperAdmin