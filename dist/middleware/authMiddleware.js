"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    console.log(`Token: ${token}`); // Debugging line
    const authHeader = req.headers['authorization'];
    console.log('Authorization Header:', authHeader);
    if (!token) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = yield user_1.default.findById(decoded.id);
        console.log(`User ID: ${(_b = req.user) === null || _b === void 0 ? void 0 : _b._id}`); // Debugging line
        console.log(`User Role: ${(_c = req.user) === null || _c === void 0 ? void 0 : _c.role}`); // Debugging line
        next();
    }
    catch (error) {
        console.error('JWT verification error:', error); // Debugging line
        res.status(401).json({ message: 'Not authorized' });
    }
});
exports.protect = protect;
exports.default = exports.protect;
