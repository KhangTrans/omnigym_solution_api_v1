import { Router } from 'express';
import { createMembershipPayment, handlePayOSWebhook, getTransactionStatus } from '../controllers/payment.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = Router();

// Endpoint checkout cho gói membership (yêu cầu đăng nhập)
router.post('/checkout-membership', isAuthenticated, createMembershipPayment);

// Endpoint webhook cho PayOS (công khai, không yêu cầu xác thực)
router.post('/webhook', handlePayOSWebhook);

// Endpoint lấy trạng thái giao dịch (yêu cầu đăng nhập)
router.get('/status/:transactionId', isAuthenticated, getTransactionStatus);

export default router;
