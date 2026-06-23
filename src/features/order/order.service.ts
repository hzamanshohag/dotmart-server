import crypto from 'crypto'; // 👈 Built-in Node.js module (Fixes ERR_REQUIRE_ESM)
import axios from 'axios';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import Order from './order.model';
import { AppError } from '../../helpers/AppError';
import User from '../user/user.model';
import { Product } from '../product/product.model';
import { CreateOrderPayload } from './order.interface';

const createOrder = async (payload: CreateOrderPayload) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  // 👈 Using randomUUID() instead of uuidv4()
  const transactionId = `ord-${crypto.randomUUID().replace(/-/g, '').slice(0, 12).toLowerCase()}`;

  try {
    const { user, items } = payload;

    if (!items?.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Order must contain items');
    }

    let totalAmount = 0;
    const orderItems = [];

    // Validate products and calculate total
    for (const item of items) {
      const product = await Product.findById(item.product).session(session);

      if (!product) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
      }

      if (!product.stock || (typeof product.stock === 'number' && product.stock < item.quantity)) {
        throw new AppError(StatusCodes.BAD_REQUEST, `${product.name} is out of stock`);
      }

      if (product.price == null) {
        throw new AppError(StatusCodes.BAD_REQUEST, `${product.name} has no price`);
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create Order
    const [order] = await Order.create(
      [
        {
          user,
          items: orderItems,
          totalAmount,
          paymentStatus: 'pending',
          orderStatus: 'pending',
          transactionId,
          OrderId: transactionId,
        },
      ],
      { session },
    );

    const userInfo = await User.findById(user);

    if (!userInfo) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
    }

    // Add order history
    await User.findByIdAndUpdate(
      user,
      {
        $push: { orderHistory: order._id },
      },
      { session },
    );

    // AamarPay Payment Request
    const paymentPayload = {
      store_id: process.env.AAMARPAY_STORE_ID,
      signature_key: process.env.AAMARPAY_SIGNATURE_KEY,

      tran_id: transactionId,
      amount: totalAmount.toFixed(2),
      currency: 'BDT',
      desc: 'Dot Mart Order Payment',

      cus_name: userInfo.name,
      cus_email: userInfo.email,
      cus_phone: userInfo.phoneNumber || '01700000000',

      success_url: `${process.env.FRONTEND_DOMAIN}/user/payment/success/${transactionId}`,
      fail_url: `${process.env.FRONTEND_DOMAIN}/user/payment/fail/${transactionId}`,
      cancel_url: `${process.env.FRONTEND_DOMAIN}/user/payment/cancel/${transactionId}`,

      type: 'json',
    };

    const { data } = await axios.post(
      process.env.NODE_ENV === 'production'
        ? 'https://secure.aamarpay.com/jsonpost.php'
        : 'https://sandbox.aamarpay.com/jsonpost.php',
      paymentPayload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (data.result !== 'true') {
      throw new AppError(StatusCodes.BAD_GATEWAY, data.message || 'Payment initiation failed');
    }

    await session.commitTransaction();
    session.endSession();

    return {
      order,
      paymentUrl: data.payment_url,
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    console.error('AamarPay Error:', error?.response?.data || error.message);

    throw new AppError(StatusCodes.BAD_REQUEST, error?.response?.data?.message || error.message);
  }
};

const getAllOrders = async () => {
  return Order.find().populate('user', 'name email').populate('items.product', 'name images price');
};

const getSingleOrder = async (id: string) => {
  const result = await Order.findById(id)
    .populate('user', 'name email')
    .populate('items.product', 'name images price');

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  return result;
};

const getSingleOrderByOrderID = async (OrderId: string) => {
  const result = await Order.findOne({ OrderId })
    .populate('user', 'name email')
    .populate('items.product', 'name images price');

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  return result;
};

const getUserOrders = async (userId: string) => {
  return Order.find({ user: userId })
    .populate('items.product', 'name images price')
    .sort({ createdAt: -1 });
};

const updateOrderStatus = async (id: string, status: string) => {
  const result = await Order.findByIdAndUpdate(id, { orderStatus: status }, { new: true });

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  return result;
};

const updatePaymentStatus = async (id: string, status: string) => {
  const result = await Order.findByIdAndUpdate(id, { paymentStatus: status }, { new: true });

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  return result;
};

const verifyPayment = async (transactionId: string) => {
  if (!transactionId) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Transaction ID is required');
  }

  const orderData = await Order.findOne({
    OrderId: transactionId,
  });

  if (!orderData) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  if (orderData.paymentStatus !== 'paid') {
    await Order.findOneAndUpdate(
      { OrderId: transactionId },
      {
        paymentStatus: 'paid',
        orderStatus: 'processing',
      },
      { new: true },
    );
  }

  const updatedOrder = await Order.findOne({
    OrderId: transactionId,
  })
    .populate('user', 'name email')
    .populate('items.product', 'name images price');

  return {
    transactionId,
    status: 'paid',
    orderData: updatedOrder,
  };
};

const paymentWebhook = async (payload: any) => {
  const { invoiceId, status, transaction_id, provider, senderNumber, amount, metadata } = payload;

  if (!invoiceId) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invoice ID is required');
  }

  // get OrderId from metadata
  const OrderId = metadata?.orderId;

  if (!OrderId) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'OrderId not found in metadata');
  }

  const order = await Order.findOne({ OrderId });

  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  // prevent duplicate webhook update
  if (order.paymentStatus === 'paid') {
    return {
      message: 'Payment already processed',
      order,
    };
  }

  if (status === 'COMPLETED') {
    const updatedOrder = await Order.findOneAndUpdate(
      { OrderId },
      {
        invoiceId,
        transactionId: transaction_id,
        paymentMethod: provider,
        senderNumber,
        paidAmount: amount,
        paymentStatus: 'paid',
        orderStatus: 'processing',
      },
      { new: true },
    )
      .populate('user', 'name email')
      .populate('items.product', 'name images price');

    return {
      message: 'Payment completed and order updated',
      order: updatedOrder,
    };
  }

  if (status === 'FAILED') {
    await Order.findOneAndUpdate(
      { OrderId },
      {
        invoiceId,
        paymentStatus: 'failed',
      },
    );

    return {
      message: 'Payment failed',
    };
  }

  if (status === 'PENDING') {
    return {
      message: 'Payment pending',
    };
  }

  return {
    message: 'Webhook received',
  };
};

export const orderService = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getUserOrders,
  updateOrderStatus,
  updatePaymentStatus,
  verifyPayment,
  getSingleOrderByOrderID,
  paymentWebhook,
};
