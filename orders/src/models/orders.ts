import mongoose from 'mongoose';
import { OrderStatus } from '@dellticketing/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { TicketDocument } from './ticket';

export { OrderStatus };

interface OrdersAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDocument;
}

export interface OrderDocument extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  version: number;
  ticket: TicketDocument;
}

interface OrderModel extends mongoose.Model<OrderDocument> {
  build(attrs: OrdersAttrs): OrderDocument;
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.CREATED
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date
  }, ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrdersAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDocument, OrderModel>('Order', orderSchema);

export { Order };
