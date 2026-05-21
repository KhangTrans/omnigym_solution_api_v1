import { Router } from 'express';
import { requestOTP, completeRegistration, login, logout, getProfile } from '../controllers/auth.controller.js';

const router = Router();

router.post('/request-otp', requestOTP);
router.post('/register', completeRegistration);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getProfile);

export default router;
