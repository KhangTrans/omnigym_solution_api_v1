import { Router } from 'express';
import { createBranch, getBranches, getBranchDetail, updateBranch } from '../controllers/branch.controller.js';
import { isAuthenticated, authorizeRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Chỉ Admin mới được tạo chi nhánh mới
router.post('/', isAuthenticated, authorizeRole(['Admin']), createBranch);

// Công khai danh sách và chi tiết chi nhánh
router.get('/', getBranches);
router.get('/:id', getBranchDetail);

// Chỉ Admin hoặc BranchManager được gán quản lý chi nhánh mới được sửa
router.put('/:id', isAuthenticated, authorizeRole(['Admin', 'BranchManager']), updateBranch);

export default router;
