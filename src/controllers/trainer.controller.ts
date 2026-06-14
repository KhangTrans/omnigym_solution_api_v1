import { Request, Response } from "express";
import { getPublicTrainerDetail } from "../services/trainer.service.js";

/**
 * GET /api/trainers/:id
 * Public endpoint — không cần đăng nhập.
 * Trả về chi tiết một huấn luyện viên đang active.
 */
export const getPublicTrainerDetailHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const rawId = req.params.id;
    const trainerId = Number(rawId);

    if (!rawId || Number.isNaN(trainerId) || trainerId <= 0) {
      return res.status(400).json({
        message: "ID huấn luyện viên không hợp lệ.",
      });
    }

    const trainer = await getPublicTrainerDetail(trainerId);

    return res.json({
      message: "Lấy chi tiết huấn luyện viên thành công.",
      data: trainer,
    });
  } catch (error: any) {
    const status = error?.status ?? 500;
    const message =
      error?.message ?? "Lỗi máy chủ khi lấy chi tiết huấn luyện viên.";
    if (status === 500) {
      console.error("[trainer.controller] getPublicTrainerDetail error:", error);
    }
    return res.status(status).json({ message });
  }
};
