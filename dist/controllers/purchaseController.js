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
exports.purchaseTickets = void 0;
const ticket_1 = __importDefault(require("../models/ticket"));
const purchase_1 = __importDefault(require("../models/purchase")); // Import the Purchase model
const purchaseTickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { ticketId, quantity } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assume user ID is available from middleware
    if (!ticketId || !quantity) {
        return res.status(400).json({ message: 'Ticket ID and quantity are required.' });
    }
    try {
        // Find the ticket by ID
        const ticket = yield ticket_1.default.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found.' });
        }
        // Check if sufficient tickets are available
        if (ticket.availableTickets < quantity) {
            return res.status(400).json({ message: 'Not enough tickets available.' });
        }
        // Update ticket availability
        ticket.availableTickets -= quantity;
        yield ticket.save();
        // Record the purchase
        const purchase = new purchase_1.default({
            userId,
            ticketId,
            quantity,
            purchaseDate: new Date()
        });
        yield purchase.save();
        // Respond with success
        res.status(200).json({ message: 'Tickets purchased successfully.' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred.' });
        }
    }
});
exports.purchaseTickets = purchaseTickets;
