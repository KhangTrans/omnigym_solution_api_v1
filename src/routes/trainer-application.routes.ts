import { Router } from "express";
import {
  createTrainerApplicationHandler,
  getTrainerApplicationsHandler,
  getTrainerApplicationByIdHandler,
  getMyTrainerApplicationHandler,
  approveTrainerApplicationHandler,
  rejectTrainerApplicationHandler,
  saveTrainerApplicationDraftHandler,
} from "../controllers/trainer-application.controller.js";
import {
  isAuthenticated,
  authorizeRole,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/draft", isAuthenticated, saveTrainerApplicationDraftHandler);

router.post("/", isAuthenticated, createTrainerApplicationHandler);

router.get("/me", isAuthenticated, getMyTrainerApplicationHandler);

router.get(
  "/",
  isAuthenticated,
  authorizeRole(["Admin", "Staff"]),
  getTrainerApplicationsHandler,
);

router.get(
  "/:id",
  isAuthenticated,
  authorizeRole(["Admin", "Staff"]),
  getTrainerApplicationByIdHandler,
);

router.patch(
  "/:id/approve",
  isAuthenticated,
  authorizeRole(["Admin", "Staff"]),
  approveTrainerApplicationHandler,
);

router.patch(
  "/:id/reject",
  isAuthenticated,
  authorizeRole(["Admin", "Staff"]),
  rejectTrainerApplicationHandler,
);

export default router;
