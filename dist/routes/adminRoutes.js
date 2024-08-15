"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const adminMiddleware_1 = __importDefault(require("../middleware/adminMiddleware"));
const router = (0, express_1.Router)();
router.get('/admin-data', authMiddleware_1.default, adminMiddleware_1.default);
//router.post('/tickets', protect, isAdmin, createTicket); 
exports.default = router;
