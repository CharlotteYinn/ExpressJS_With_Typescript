"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUser = void 0;
const isUser = (req, res, next) => {
    var _a;
    console.log(`User role in isUser: ${(_a = req.user) === null || _a === void 0 ? void 0 : _a.role}`); // Debugging line
    if (req.user && req.user.role === 'user') {
        next();
    }
    else {
        res.status(403).json({ message: 'Access denied. User only.' });
    }
};
exports.isUser = isUser;
exports.default = exports.isUser;
