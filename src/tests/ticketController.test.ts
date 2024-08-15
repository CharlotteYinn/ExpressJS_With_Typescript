import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import Ticket from '../models/ticket';
import { createTicket} from '../controllers/ticketController';

// Initialize Express app
const app = express();
app.use(express.json());
app.post('/api/tickets/create', createTicket);

// Mock Mongoose connection
beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/ticketdb', { useNewUrlParser: true, useUnifiedTopology: true });
});

// Clean up the database after each test
afterEach(async () => {
  await Ticket.deleteMany({});
});

// Close database connection after tests
afterAll(async () => {
  await mongoose.disconnect();
});

// Tests for createTicket
  it('should return 401 if user is not authenticated', async () => {
    const response = await request(app)
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
  });


