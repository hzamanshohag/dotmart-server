import express from 'express';
import { orderController } from './order.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

// user
router.post('/orders', auth('USER', 'ADMIN'), orderController.createOrder);
router.get('/orders/user/:userId', auth('USER', 'ADMIN'), orderController.getUserOrders);
router.get('/orders/:orderId', auth('USER', 'ADMIN'), orderController.getSingleOrder);
router.get('/order/:orderId', auth('USER', 'ADMIN'), orderController.getSingleOrderByOrderID);

// admin
router.get('/orders', auth('ADMIN'), orderController.getAllOrders);
router.patch('/orders/:orderId/status', auth('ADMIN'), orderController.updateOrderStatus);
router.patch('/orders/:orderId/payment', auth('ADMIN'), orderController.updatePaymentStatus);

//payment verify
// router.get('/payment/success/:transactionId', orderController.paymentSuccess);
// router.get('/payment/webhook', orderController.paymentWebhook);

router.post('/payment/success/:transactionId', orderController.verifyPayment);
router.post('/payment/fail/:transactionId', orderController.verifyPayment);

// router.post('/payment/cancel/:transactionId', orderController.paymentCancel);

export const OrderRoutes = router;
