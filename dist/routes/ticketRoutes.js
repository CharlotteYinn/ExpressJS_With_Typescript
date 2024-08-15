"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticketController_1 = require("../controllers/ticketController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const adminMiddleware_1 = __importDefault(require("../middleware/adminMiddleware"));
const userMiddleware_1 = __importDefault(require("../middleware/userMiddleware"));
const router = (0, express_1.Router)();
//for admin
router.post('/create', authMiddleware_1.default, adminMiddleware_1.default, ticketController_1.createTicket); // Create a new ticket
router.get('/getAll', authMiddleware_1.default, adminMiddleware_1.default, ticketController_1.getTickets); // Get all tickets
router.get('/getById/:id', authMiddleware_1.default, adminMiddleware_1.default, ticketController_1.getTicketById); // Get ticket by ID
router.put('/update/:id', authMiddleware_1.default, adminMiddleware_1.default, ticketController_1.updateTicket); // Update ticket by ID
router.delete('/delete/:id', authMiddleware_1.default, adminMiddleware_1.default, ticketController_1.deleteTicket); // Delete ticket by ID
//for all
router.get('/search', ticketController_1.searchTickets); // Search Tickets
//for user only
router.post('/purchase', authMiddleware_1.default, userMiddleware_1.default, ticketController_1.purchaseTickets);
router.get('/purchase/history', authMiddleware_1.default, userMiddleware_1.default, ticketController_1.getPurchaseHistory);
exports.default = router;
