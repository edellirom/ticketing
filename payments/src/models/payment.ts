import mongoose from 'mongoose';

export interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

export interface PaymentDocument extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

export interface PaymentModel extends mongoose.Model<PaymentDocument> {
  build(attrs: PaymentAttrs): PaymentDocument;
}

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  stripeId: {
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

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDocument, PaymentModel>('Payment', paymentSchema);

export { Payment };
