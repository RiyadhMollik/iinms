import express from "express";
import {
  createMeeting,
  getMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
  markAttendance,
  getAttendanceReport,
} from "../controllers/meetingController.js";

const router = express.Router();

// Meeting routes
router.post("/", createMeeting);
router.get("/", getMeetings);
router.get("/:id", getMeetingById);
router.put("/:id", updateMeeting);
router.delete("/:id", deleteMeeting);

// Attendance routes
router.post("/:meetingId/attendance", markAttendance);
router.get("/:meetingId/attendance-report", getAttendanceReport);

export default router; 