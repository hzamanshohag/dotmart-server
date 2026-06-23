import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { orderService } from './order.service';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await orderService.createOrder(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Order placed successfully',
    data: result,
  });
});

const getAllOrders = catchAsync(async (_req: Request, res: Response) => {
  const result = await orderService.getAllOrders();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Orders fetched successfully',
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const result = await orderService.getSingleOrder(orderId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Order fetched successfully',
    data: result,
  });
});

const getSingleOrderByOrderID = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const result = await orderService.getSingleOrderByOrderID(orderId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Order fetched successfully',
    data: result,
  });
});

const getUserOrders = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const result = await orderService.getUserOrders(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User orders fetched successfully',
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const result = await orderService.updateOrderStatus(orderId, status);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Order status updated successfully',
    data: result,
  });
});

const updatePaymentStatus = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const result = await orderService.updatePaymentStatus(orderId, status);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Payment status updated successfully',
    data: result,
  });
});

const verifyPayment = catchAsync(async (req: Request, res: Response) => {
  const { transactionId } = req.params;

  // 2️⃣ Verify payment from service
  const result = await orderService.verifyPayment(transactionId);

  // 3️⃣ Send proper response
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Payment verification completed successfully',
    data: result,
  });
});

const paymentWebhook = catchAsync(async (req: Request, res: Response) => {
  const result = await orderService.paymentWebhook(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Webhook processed successfully',
    data: result,
  });
});


export const orderController = {
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
