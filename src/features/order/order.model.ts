import { Schema, model } from 'mongoose';
import { IOrder } from './order.interface';

const orderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (arr: any[]) => arr.length > 0,
        message: 'Order must contain at least one item',
      },
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },

    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'delivered', 'cancelled'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      required: false,
    },
    OrderId: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: false,
    },
    senderNumber: {
      type: String,
      required: false,
    },
    invoiceId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const Order = model<IOrder>('Order', orderSchema);
export default Order;
