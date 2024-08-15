"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const isAdmin = (req, res, next) => {
    var _a;
    console.log(`User role in isAdmin: ${(_a = req.user) === null || _a === void 0 ? void 0 : _a.role}`); // Debugging line
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};
exports.isAdmin = isAdmin;
exports.default = exports.isAdmin;
