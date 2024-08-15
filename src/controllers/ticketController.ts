import { Request, Response } from 'express';
import Ticket from '../models/ticket';
import Purchase from '../models/purchase'; 
// Create a new ticket
export const createTicket = async (req: Request, res: Response) => {
    
    
    const { eventName, eventDate, eventTime ,venue, category,price, availableTickets } = req.body;
    const userId = (req as any).user?._id;
    if (!userId) {
        return res.status(401).send('User not authenticated.');
    }
    
      console.log('Creating ticket for user:', userId);
    try {
       
        const ticket = new Ticket({ eventName, eventDate, eventTime ,venue, category,price, availableTickets, createdBy: userId });
        await ticket.save();
        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all tickets
export const getTickets = async (req: Request, res: Response) => {
    try {
        const tickets = await Ticket.find();
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get a single ticket by ID
export const getTicketById = async (req: Request, res: Response) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a ticket by ID
export const updateTicket = async (req: Request, res: Response) => {

    const userId = (req as any).user?._id;
    try {
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        if (ticket.createdBy.toString() !== userId.toString()) {
            return res.status(403).send('You are not authorized to edit this ticket.');
        }

        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a ticket by ID
export const deleteTicket = async (req: Request, res: Response) => {

    const userId = (req as any).user?._id;
    try {
        const ticket = await Ticket.findByIdAndDelete(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        if (ticket.createdBy.toString() !== userId.toString()) {
            return res.status(403).send('You are not authorized to delete this ticket.');
        }

        res.json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

//Search ticket
export const searchTickets = async (req: Request, res: Response) => {
    const { eventName, category, minPrice, maxPrice, minAvailableTickets, maxAvailableTickets } = req.query;
  
    try {
      // Build the search query
      const query: any = {};
  
      if (eventName) query.eventName = { $regex: new RegExp(eventName as string, 'i') };
      if (category) query.category = category;
      
      const tickets = await Ticket.find(query);
      console.log('Tickets Found:', tickets);
      if (tickets.length === 0) {
        return res.status(404).json({ message: 'No tickets found with the given criteria.' });
      }
  
      res.status(200).json(tickets);
    } catch (error) {
      const typedError = error as Error; 
      res.status(400).send(typedError.message);
    }
  };


  export const purchaseTickets = async (req: Request, res: Response) => {
    const { ticketId, quantity } = req.body;
    const userId = req.user?.id;  // Assume user ID is available from middleware
  
    if (!ticketId || !quantity) {
      return res.status(400).json({ message: 'Ticket ID and quantity are required.' });
    }
  
    try {
      // Find the ticket by ID
      const ticket = await Ticket.findById(ticketId);
  
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found.' });
      }
  
      // Check if sufficient tickets are available
      if (ticket.availableTickets < quantity) {
        return res.status(400).json({ message: 'Not enough tickets available.' });
      }
     
      // Update ticket availability
      ticket.availableTickets -= quantity;
      await ticket.save();
      
      // Record the purchase
        const purchase = new Purchase({
          userId,
          ticketId,
          quantity,
          purchaseDate: new Date()
      });
      await purchase.save();
  
      // Respond with success
      res.status(200).json({ message: 'Tickets purchased successfully.' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred.' });
      }
    }
  };

  export const getPurchaseHistory = async (req: Request, res: Response) => {
    const userId = (req as any).user?._id; // Get user ID from the request

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        const purchases = await Purchase.find({ userId }).populate('ticketId', 'eventName eventDate eventTime'); // Populate ticket details if needed

        if (purchases.length === 0) {
            return res.status(404).json({ message: 'No purchases found for this user' });
        }

        res.status(200).json(purchases);
    } catch (error) {
        console.error('Error fetching purchase history:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
