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
exports.getPurchaseHistory = exports.purchaseTickets = exports.searchTickets = exports.deleteTicket = exports.updateTicket = exports.getTicketById = exports.getTickets = exports.createTicket = void 0;
const ticket_1 = __importDefault(require("../models/ticket"));
const purchase_1 = __importDefault(require("../models/purchase"));
// Create a new ticket
const createTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { eventName, eventDate, eventTime, venue, category, price, availableTickets } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId) {
        return res.status(401).send('User not authenticated.');
    }
    console.log('Creating ticket for user:', userId);
    try {
        const ticket = new ticket_1.default({ eventName, eventDate, eventTime, venue, category, price, availableTickets, createdBy: userId });
        yield ticket.save();
        res.status(201).json(ticket);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.createTicket = createTicket;
// Get all tickets
const getTickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tickets = yield ticket_1.default.find();
        res.json(tickets);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getTickets = getTickets;
// Get a single ticket by ID
const getTicketById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ticket = yield ticket_1.default.findById(req.params.id);
        if (!ticket)
            return res.status(404).json({ message: 'Ticket not found' });
        res.json(ticket);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getTicketById = getTicketById;
// Update a ticket by ID
const updateTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
    try {
        const ticket = yield ticket_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!ticket)
            return res.status(404).json({ message: 'Ticket not found' });
        if (ticket.createdBy.toString() !== userId.toString()) {
            return res.status(403).send('You are not authorized to edit this ticket.');
        }
        res.json(ticket);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.updateTicket = updateTicket;
// Delete a ticket by ID
const deleteTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id;
    try {
        const ticket = yield ticket_1.default.findByIdAndDelete(req.params.id);
        if (!ticket)
            return res.status(404).json({ message: 'Ticket not found' });
        if (ticket.createdBy.toString() !== userId.toString()) {
            return res.status(403).send('You are not authorized to delete this ticket.');
        }
        res.json({ message: 'Ticket deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.deleteTicket = deleteTicket;
//Search ticket
const searchTickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventName, category, minPrice, maxPrice, minAvailableTickets, maxAvailableTickets } = req.query;
    try {
        // Build the search query
        const query = {};
        if (eventName)
            query.eventName = { $regex: new RegExp(eventName, 'i') };
        if (category)
            query.category = category;
        const tickets = yield ticket_1.default.find(query);
        console.log('Tickets Found:', tickets);
        if (tickets.length === 0) {
            return res.status(404).json({ message: 'No tickets found with the given criteria.' });
        }
        res.status(200).json(tickets);
    }
    catch (error) {
        const typedError = error;
        res.status(400).send(typedError.message);
    }
});
exports.searchTickets = searchTickets;
const purchaseTickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { ticketId, quantity } = req.body;
    const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id; // Assume user ID is available from middleware
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
const getPurchaseHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const userId = (_e = req.user) === null || _e === void 0 ? void 0 : _e._id; // Get user ID from the request
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        const purchases = yield purchase_1.default.find({ userId }).populate('ticketId', 'eventName eventDate eventTime'); // Populate ticket details if needed
        if (purchases.length === 0) {
            return res.status(404).json({ message: 'No purchases found for this user' });
        }
        res.status(200).json(purchases);
    }
    catch (error) {
        console.error('Error fetching purchase history:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getPurchaseHistory = getPurchaseHistory;
