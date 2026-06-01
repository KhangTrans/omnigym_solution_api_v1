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
  authorizeRole(["Admin", "Staff", "Partner"]),
  getTrainerApplicationsHandler,
);

router.get(
  "/:id",
  isAuthenticated,
  authorizeRole(["Admin", "Staff", "Partner"]),
  getTrainerApplicationByIdHandler,
);

router.patch(
  "/:id/approve",
  isAuthenticated,
  authorizeRole(["Admin", "Staff", "Partner"]),
  approveTrainerApplicationHandler,
);

router.patch(
  "/:id/reject",
  isAuthenticated,
  authorizeRole(["Admin", "Staff", "Partner"]),
  rejectTrainerApplicationHandler,
);

export default router;
