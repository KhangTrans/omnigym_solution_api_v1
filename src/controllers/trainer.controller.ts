import { Request, Response } from "express";
import {
  getApprovedTrainers,
  updateTrainerStatus,
  getPublicTrainerDetail,
} from "../services/trainer.service.js";

export const getApprovedTrainersHandler = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(401).json({ message: "Chưa xác thực người dùng." });
    }
    const trainers = await getApprovedTrainers(currentUser);
    res.json({
      status: "success",
      data: trainers,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTrainerStatusHandler = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(401).json({ message: "Bạn cần đăng nhập." });
    }

    const trainerId = Number(req.params.id);
    if (!Number.isFinite(trainerId)) {
      return res.status(400).json({ message: "ID huấn luyện viên không hợp lệ." });
    }

    const status = String(req.body?.status || "").toLowerCase();
    if (!["active", "locked"].includes(status)) {
      return res.status(400).json({
        message: "Trạng thái không hợp lệ. Chỉ chấp nhận active hoặc locked.",
      });
    }

    const result = await updateTrainerStatus(trainerId, status, currentUser);

    return res.json({
      message:
        status === "locked"
          ? "Đã đình chỉ tài khoản huấn luyện viên."
          : "Đã mở khoá tài khoản huấn luyện viên.",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

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