import { Router } from 'express';
import { createPost, getAllPosts, approvePost, getPostById, updatePost, deletePost } from '../controllers/post.controller.js';
import { isAuthenticated, authorizeRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Mọi người có thể xem bài post đã duyệt, Admin/Staff/Partner có thể xem cả bài chưa duyệt
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// Chỉ Staff, Partner, Admin mới có thể tạo bài viết
router.post('/', isAuthenticated, authorizeRole(['Staff', 'Partner', 'Admin']), createPost);

// Chỉ chính tác giả hoặc Admin mới được sửa/xóa
router.put('/:id', isAuthenticated, authorizeRole(['Staff', 'Partner', 'Admin']), updatePost);
router.delete('/:id', isAuthenticated, authorizeRole(['Staff', 'Partner', 'Admin']), deletePost);

// Admin và Partner có quyền duyệt bài viết
router.patch('/:id/approve', isAuthenticated, authorizeRole(['Admin', 'Partner']), approvePost);

export default router;
