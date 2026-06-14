import { Router } from "express";
import { getApprovedTrainersHandler, updateTrainerStatusHandler } from "../controllers/trainer.controller.js";
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

export default router;
