import { Router } from 'express';
import { createFaqHandler, getFaqs, updateFaqHandler } from '../controllers/faq.controller.js';
import { isAuthenticated, authorizeRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', isAuthenticated, authorizeRole(['Admin']), getFaqs);
router.post('/', isAuthenticated, authorizeRole(['Admin']), createFaqHandler);
router.put('/:id', isAuthenticated, authorizeRole(['Admin']), updateFaqHandler);

export default router;
