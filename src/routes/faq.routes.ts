import { Router } from 'express';
import { createFaqHandler, deleteFaqHandler, getFaqs, getPublicFaqs, increaseFaqViewHandler, updateFaqHandler } from '../controllers/faq.controller.js';
import { isAuthenticated, authorizeRole } from '../middlewares/auth.middleware.js';

const router = Router();
const faqManagerRoles = ['Admin', 'Staff', 'Partner'];

router.get('/public', getPublicFaqs);
router.post('/public/:id/view', increaseFaqViewHandler);
router.get('/', isAuthenticated, authorizeRole(faqManagerRoles), getFaqs);
router.post('/', isAuthenticated, authorizeRole(faqManagerRoles), createFaqHandler);
router.put('/:id', isAuthenticated, authorizeRole(faqManagerRoles), updateFaqHandler);
router.delete('/:id', isAuthenticated, authorizeRole(faqManagerRoles), deleteFaqHandler);

export default router;
