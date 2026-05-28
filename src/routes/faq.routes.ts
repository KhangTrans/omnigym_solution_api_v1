import { Router } from 'express';
import { getFaqs } from '../controllers/faq.controller.js';
import { isAuthenticated, authorizeRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', isAuthenticated, authorizeRole(['Admin']), getFaqs);

export default router;
