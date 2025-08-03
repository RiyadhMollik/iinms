import Meeting from "../models/Meeting.js";
import Attendance from "../models/Attendance.js";
import User from "../models/user.js";
import { Op } from "sequelize";

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// Create a new meeting
export const createMeeting = async (req, res) => {
  try {
    const {
      title,
      description,
      meetingDate,
      startTime,
      endTime,
      locationLat,
      locationLng,
      locationName,
    } = req.body;

    const meeting = await Meeting.create({
      title,
      description,
      meetingDate,
      startTime,
      endTime,
      locationLat,
      locationLng,
      locationName,
      createdBy: req.body.createdBy || 1, // Default to user ID 1 if not provided
    });

    res.status(201).json({
      success: true,
      message: "Meeting created successfully",
      data: meeting,
    });
  } catch (error) {
    console.error("Error creating meeting:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create meeting",
      error: error.message,
    });
  }
};

// Get all meetings
export const getMeetings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { locationName: { [Op.like]: `%${search}%` } },
      ];
    }

    const meetings = await Meeting.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "mobileNumber"],
        },
      ],
      order: [["meetingDate", "DESC"], ["startTime", "ASC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      success: true,
      data: meetings.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(meetings.count / limit),
        totalMeetings: meetings.count,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch meetings",
      error: error.message,
    });
  }
};

// Get meeting by ID with attendance details
export const getMeetingById = async (req, res) => {
  try {
    const { id } = req.params;

    const meeting = await Meeting.findByPk(id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "mobileNumber"],
        },
        {
          model: Attendance,
          as: "Attendances",
          include: [
            {
              model: User,
              as: "User",
              attributes: ["id", "name", "mobileNumber", "role"],
            },
          ],
        },
      ],
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // Get all users with roleId 12 (Agromet Scientists)
    const eligibleUsers = await User.findAll({
      where: { roleId: 12 },
      attributes: ["id", "name", "mobileNumber", "role"],
    });

    // Create attendance summary
    const attendanceSummary = {
      present: [],
      absent: [],
      late: [],
    };

    // Check who attended
    meeting.Attendances.forEach((attendance) => {
      if (attendance.status === "present") {
        attendanceSummary.present.push(attendance.User);
      } else if (attendance.status === "late") {
        attendanceSummary.late.push(attendance.User);
      }
    });

    // Check who is absent
    const attendedUserIds = meeting.Attendances.map((a) => a.userId);
    attendanceSummary.absent = eligibleUsers.filter(
      (user) => !attendedUserIds.includes(user.id)
    );

    res.status(200).json({
      success: true,
      data: {
        meeting,
        attendanceSummary,
        totalEligible: eligibleUsers.length,
        totalPresent: attendanceSummary.present.length,
        totalAbsent: attendanceSummary.absent.length,
        totalLate: attendanceSummary.late.length,
      },
    });
  } catch (error) {
    console.error("Error fetching meeting:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch meeting",
      error: error.message,
    });
  }
};

// Update meeting
export const updateMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const meeting = await Meeting.findByPk(id);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    await meeting.update(updateData);

    res.status(200).json({
      success: true,
      message: "Meeting updated successfully",
      data: meeting,
    });
  } catch (error) {
    console.error("Error updating meeting:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update meeting",
      error: error.message,
    });
  }
};

// Delete meeting
export const deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const meeting = await Meeting.findByPk(id);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // Delete related attendance records first
    await Attendance.destroy({ where: { meetingId: id } });
    
    // Delete the meeting
    await meeting.destroy();

    res.status(200).json({
      success: true,
      message: "Meeting deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting meeting:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete meeting",
      error: error.message,
    });
  }
};

// Mark attendance for a user
export const markAttendance = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { userId = 1, checkInLat, checkInLng } = req.body; // Default to user ID 1 if not provided

    // Check if meeting exists and is ongoing
    const meeting = await Meeting.findByPk(meetingId);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // Check if user has roleId 12 (Agromet Scientists)
    const user = await User.findByPk(userId);
    if (!user || user.roleId !== 12) {
      return res.status(403).json({
        success: false,
        message: "User not eligible for this meeting",
      });
    }

    // Check if meeting time is within the scheduled time
    const now = new Date();
    const meetingDateTime = new Date(`${meeting.meetingDate} ${meeting.startTime}`);
    const meetingEndDateTime = new Date(`${meeting.meetingDate} ${meeting.endTime}`);

    if (now < meetingDateTime || now > meetingEndDateTime) {
      return res.status(400).json({
        success: false,
        message: "Meeting is not active at this time",
      });
    }

    // Calculate distance from meeting location
    const distance = calculateDistance(
      parseFloat(meeting.locationLat),
      parseFloat(meeting.locationLng),
      parseFloat(checkInLat),
      parseFloat(checkInLng)
    );

    // Check if within 10 meters
    if (distance > 10) {
      return res.status(400).json({
        success: false,
        message: "You are too far from the meeting location",
        distance: distance.toFixed(2),
      });
    }

    // Check if already marked attendance
    const existingAttendance = await Attendance.findOne({
      where: { meetingId, userId },
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this meeting",
      });
    }

    // Determine if late (more than 15 minutes after start time)
    const isLate = now > new Date(meetingDateTime.getTime() + 15 * 60 * 1000);

    const attendance = await Attendance.create({
      meetingId,
      userId,
      checkInTime: now,
      checkInLat,
      checkInLng,
      distance,
      status: isLate ? "late" : "present",
    });

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: {
        ...attendance.toJSON(),
        distance: distance.toFixed(2),
        status: isLate ? "late" : "present",
      },
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark attendance",
      error: error.message,
    });
  }
};

// Get attendance report for a meeting
export const getAttendanceReport = async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await Meeting.findByPk(meetingId, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "mobileNumber"],
        },
      ],
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    const attendance = await Attendance.findAll({
      where: { meetingId },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "name", "mobileNumber", "role"],
        },
      ],
      order: [["checkInTime", "ASC"]],
    });

    // Get all eligible users
    const eligibleUsers = await User.findAll({
      where: { roleId: 12 },
      attributes: ["id", "name", "mobileNumber", "role"],
    });

    const attendedUserIds = attendance.map((a) => a.userId);
    const absentUsers = eligibleUsers.filter(
      (user) => !attendedUserIds.includes(user.id)
    );

    const report = {
      meeting,
      attendance,
      absentUsers,
      summary: {
        totalEligible: eligibleUsers.length,
        totalPresent: attendance.filter((a) => a.status === "present").length,
        totalLate: attendance.filter((a) => a.status === "late").length,
        totalAbsent: absentUsers.length,
        attendanceRate: ((attendance.length / eligibleUsers.length) * 100).toFixed(2),
      },
    };

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Error generating attendance report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate attendance report",
      error: error.message,
    });
  }
}; 