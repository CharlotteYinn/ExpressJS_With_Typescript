import { Router } from 'express';
import { createTicket, getTickets, getTicketById, updateTicket, deleteTicket,searchTickets,purchaseTickets,getPurchaseHistory } from '../controllers/ticketController';
import protect from '../middleware/authMiddleware';
import isAdmin from '../middleware/adminMiddleware';
import isUser from '../middleware/userMiddleware'

const router = Router();

//for admin
router.post('/create', protect, isAdmin, createTicket); // Create a new ticket
router.get('/getAll', protect, isAdmin, getTickets); // Get all tickets
router.get('/getById/:id', protect, isAdmin, getTicketById); // Get ticket by ID
router.put('/update/:id',protect, isAdmin, updateTicket); // Update ticket by ID
router.delete('/delete/:id',protect, isAdmin, deleteTicket); // Delete ticket by ID

//for all
router.get('/search', searchTickets); // Search Tickets

//for user only
router.post('/purchase', protect, isUser, purchaseTickets);
router.get('/purchase/history',protect, isUser, getPurchaseHistory);


export default router;



