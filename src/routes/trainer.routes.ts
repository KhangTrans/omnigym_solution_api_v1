import { Router } from "express";
import { getPublicTrainerDetailHandler } from "../controllers/trainer.controller.js";

const router = Router();

// Public — không cần đăng nhập.
router.get("/:id", getPublicTrainerDetailHandler);

export default router;
