import { Router } from "express";
import {
  getApprovedTrainersHandler,
  updateTrainerStatusHandler,
  getPublicTrainerDetailHandler,
} from "../controllers/trainer.controller.js";
import { isAuthenticated, authorizeRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/approved",
  isAuthenticated,
  authorizeRole(["Admin", "BranchManager", "Staff"]),
  getApprovedTrainersHandler
);

router.patch(
  "/:id/status",
  isAuthenticated,
  authorizeRole(["Admin", "BranchManager"]),
  updateTrainerStatusHandler
);

// Public — không cần đăng nhập.
router.get("/:id", getPublicTrainerDetailHandler);

export default router;