import mongoose from 'mongoose';
import { OrderStatus } from '@dellticketing/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface OrderAttrs {
  id: string,
  version: number,
  userId: string,
  price: number,
  status: OrderStatus
}

export interface OrderDocument extends mongoose.Document {
  version: number,
  userId: string,
  price: number,
  status: OrderStatus
}

export interface OrderModel extends mongoose.Model<OrderDocument> {
  build(attrs: OrderAttrs): OrderDocument;
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

orderSchema.statics.build = (attrs: OrderAttrs) => {
  const { id, version, userId, status, price } = attrs;
  return new Order({
    _id: id,
    version,
    userId,
    status,
    price
  });
};
orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

const Order = mongoose.model<OrderDocument, OrderModel>('Order', orderSchema);

export { Order };
