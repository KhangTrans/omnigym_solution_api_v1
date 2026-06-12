import { Request, Response } from 'express';
import * as postService from '../services/post.service.js';
import { CreatePostDto } from '../dtos/post.dto.js';

export const trackPostView = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id as string);
    if (isNaN(postId)) {
      return res.status(200).json({ success: true, skipped: true });
    }

    const user = req.user!;
    const result = await postService.trackView(postId, user.id, user.role);
    return res.status(200).json(result);
  } catch (error: any) {
    // Silent fail — always return 200 so FE is never disrupted
    console.error('[trackPostView] error:', error?.message);
    return res.status(200).json({ success: false, error: 'internal' });
  }
};


export const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    const postData: CreatePostDto = req.body;
    const post = await postService.createPost(user.id, postData, user.role);

    res.status(201).json({
      message: 'Post created as draft successfully',
      post
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const userRole = req.user?.role;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const category = req.query.category as string;
    const sortBy = req.query.sortBy as string;
    const status = req.query.status as string;

    const result = await postService.getAllPosts(userRole, page, limit, search, category, sortBy, status);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const approvePost = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id as string);
    const post = await postService.approvePost(postId);
    res.json({ message: 'Post published successfully', post });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectPost = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id as string);
    const post = await postService.rejectPost(postId);
    res.json({ message: 'Post rejected successfully', post });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const submitPostForApproval = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id as string);
    const user = req.user!;

    const post = await postService.submitPostForApproval(postId, user.id, user.role);
    res.json({ message: 'Post sent for approval successfully', post });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const userRole = req.user?.role;
    const post = await postService.getPostById(id, userRole);
    res.json(post);
  } catch (error: any) {
    const status = error.message.includes('không tìm thấy') ? 404 : 403;
    res.status(status).json({ message: error.message });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const user = req.user!;

    const post = await postService.updatePost(id, user.id, user.role, req.body);
    res.json({ 
      message: user.role === 'Staff' ? 'Post updated and pending re-approval' : 'Post updated successfully', 
      post 
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const user = req.user!;

    await postService.deletePost(id, user.id, user.role);
    res.json({ message: 'Post deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
