"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = void 0;
const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (roles.includes(req.user.role)) {
            next();
        }
        else {
            res.status(403).json({ message: 'Access denied' });
        }
    };
};
exports.roleMiddleware = roleMiddleware;
