import { Types } from 'mongoose';

export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type OrderStatus = 'pending' | 'processing' | 'delivered' | 'cancelled';

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder {
  user: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  transactionId: string;
  OrderId: string;
  paymentMethod: string;
  invoiceId: string;
  senderNumber: string;
}

export interface CreateOrderPayload {
  user: string;
  items: {
    product: string;
    quantity: number;
  }[];
}
