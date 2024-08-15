import mongoose, { Document, Schema } from 'mongoose';

export interface ITicket extends Document {
    eventName: string;
    eventDate: Date;
    eventTime: string; // Format can be HH:MM or other time format
    venue: string;
    category:string;
    price: number;
    availableTickets: number,
    createdBy: mongoose.Types.ObjectId;
}

const TicketSchema: Schema = new Schema({
    eventName: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventTime: { type: String, required: true },
    venue: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    availableTickets: { type: Number, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.model<ITicket>('Ticket', TicketSchema);
