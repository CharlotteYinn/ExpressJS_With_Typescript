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
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const ticket_1 = __importDefault(require("../models/ticket"));
const ticketController_1 = require("../controllers/ticketController");
// Initialize Express app
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/api/tickets/create', ticketController_1.createTicket);
// Mock Mongoose connection
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect('mongodb://localhost:27017/ticketdb', { useNewUrlParser: true, useUnifiedTopology: true });
}));
// Clean up the database after each test
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield ticket_1.default.deleteMany({});
}));
// Close database connection after tests
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
}));
// Tests for createTicket
it('should return 401 if user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, supertest_1.default)(app)
        .post('/api/tickets/create')
        .send({
        eventName: 'Concert',
        eventDate: '2024-12-31',
        eventTime: '20:00',
        venue: 'Arena',
        category: 'Music',
        price: 50,
        availableTickets: 100,
    });
    expect(response.status).toBe(401);
}));
