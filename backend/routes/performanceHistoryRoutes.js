import express from "express";
import { savePerformanceHistory, getPerformanceHistory } from "../controllers/performanceHistoryController.js";

const router = express.Router();

router.post("/save", savePerformanceHistory);  // Save new history
router.get("/history", getPerformanceHistory); // Get all history

export default router;
