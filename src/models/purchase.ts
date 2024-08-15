// models/purchase.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IPurchase extends Document {
    userId: mongoose.Types.ObjectId;
    ticketId: mongoose.Types.ObjectId;
    quantity: number;
    purchaseDate: Date;
}

const PurchaseSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ticketId: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
    quantity: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now }
});

const Purchase = mongoose.model<IPurchase>('Purchase', PurchaseSchema);

export default Purchase;
