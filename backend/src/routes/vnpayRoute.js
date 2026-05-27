import express from "express";

import vnpayController from "../controllers/vnpayController.js";
import { authenticateToken, requireRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
    "/create-payment-url",
    authenticateToken,
    requireRole("admin", "user"),
    vnpayController.createPaymentUrl
);
router.get("/return", vnpayController.handleReturn);

export default router;
