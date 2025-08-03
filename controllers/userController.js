import bcrypt from "bcrypt";
import User from "../models/user.js";
import Farmer from "../models/RegistedUser.js";
import Meeting from "../models/Meeting.js";
import Attendance from "../models/Attendance.js";
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

// Check for active meetings for Agromet Scientists and auto-mark attendance
const checkActiveMeetingsForUser = async (userId, userLat, userLng) => {
  try {
    const now = new Date();
    const currentTime = now.toTimeString().split(' ')[0]; // Get current time in HH:MM:SS format
    const currentDate = now.toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    // Find active meetings
    const activeMeetings = await Meeting.findAll({
      where: {
        meetingDate: currentDate,
        startTime: { [Op.lte]: currentTime },
        endTime: { [Op.gte]: currentTime },
        status: { [Op.in]: ['scheduled', 'ongoing'] }
      },
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "mobileNumber"],
        },
      ],
    });

    const meetingsWithDistance = [];
    const autoMarkedMeetings = [];

    for (const meeting of activeMeetings) {
      // Check if user already marked attendance for this meeting
      const existingAttendance = await Attendance.findOne({
        where: { meetingId: meeting.id, userId }
      });

      if (!existingAttendance && userLat && userLng) {
        // Calculate distance from meeting location
        const distance = calculateDistance(
          parseFloat(meeting.locationLat),
          parseFloat(meeting.locationLng),
          parseFloat(userLat),
          parseFloat(userLng)
        );

        // Check if within 10 meters - AUTO MARK ATTENDANCE
        if (distance <= 10) {
          // Determine if late (more than 15 minutes after start time)
          const meetingDateTime = new Date(`${meeting.meetingDate} ${meeting.startTime}`);
          const isLate = now > new Date(meetingDateTime.getTime() + 15 * 60 * 1000);

          // Auto-mark attendance
          const attendance = await Attendance.create({
            meetingId: meeting.id,
            userId,
            checkInTime: now,
            checkInLat: userLat,
            checkInLng: userLng,
            distance,
            status: isLate ? "late" : "present",
          });

          autoMarkedMeetings.push({
            ...meeting.toJSON(),
            distance: distance.toFixed(2),
            attendanceStatus: attendance.status,
            message: `Attendance automatically marked as ${attendance.status}!`
          });
        } else {
          meetingsWithDistance.push({
            ...meeting.toJSON(),
            distance: distance.toFixed(2),
            canMarkAttendance: false,
            message: `You are ${distance.toFixed(2)}m away from the meeting location. Please move closer to mark attendance.`
          });
        }
      } else if (existingAttendance) {
        meetingsWithDistance.push({
          ...meeting.toJSON(),
          canMarkAttendance: false,
          message: "Attendance already marked for this meeting.",
          attendanceStatus: existingAttendance.status
        });
      } else {
        meetingsWithDistance.push({
          ...meeting.toJSON(),
          canMarkAttendance: false,
          message: "Location not provided. Please enable location services."
        });
      }
    }

    return {
      autoMarkedMeetings,
      otherMeetings: meetingsWithDistance
    };
  } catch (error) {
    console.error("Error checking active meetings:", error);
    return { autoMarkedMeetings: [], otherMeetings: [] };
  }
};
// Create a new user
export const createUser = async (req, res) => {
  const { name, role, mobileNumber, password, farmerId , roleId } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, role, mobileNumber, password: hashedPassword, farmerId , roleId });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User login
export const loginUser = async (req, res) => {
  const { mobileNumber, password, userLat, userLng } = req.body;

  try {
    const user = await User.findOne({ where: { mobileNumber } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if user is Agromet Scientist (roleId: 12)
    if (user.roleId === 12) {
      const meetingResults = await checkActiveMeetingsForUser(user.id, userLat, userLng);
      
      res.json({ 
        message: "Login successful", 
        user,
        autoMarkedMeetings: meetingResults.autoMarkedMeetings,
        otherMeetings: meetingResults.otherMeetings,
        isAgrometScientist: true
      });
    } else {
      res.json({ 
        message: "Login successful", 
        user,
        isAgrometScientist: false
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ include: [Farmer] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, role, mobileNumber, password, farmerId , roleId } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;

    await user.update({ name, role, mobileNumber, password: hashedPassword, farmerId , roleId });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
      include: [Farmer],
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update only user password
export const updateUserPassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTodayUtcRange = () => {
  const now = new Date();

  const start = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    0, 0, 0, 0
  ));

  const end = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    23, 59, 59, 999
  ));

  return { start, end };
};

export const createTodaySAAOUsers = async (req, res) => {
  try {
    const { start, end } = getTodayUtcRange();

    const todaySAAOs = await Farmer.findAll({
      where: {
        role: 'saao',
        createdAt: {
          [Op.between]: [start, end],
        },
      },
    });

    if (todaySAAOs.length === 0) {
      return res.status(200).json({ message: "No SAAO registered today." });
    }

    const createdUsers = [];

    for (const saao of todaySAAOs) {
      const existingUser = await User.findOne({ where: { farmerId: saao.id } });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(saao.mobileNumber, 10);
        const user = await User.create({
          name: saao.name,
          role: "SAAO",
          mobileNumber: saao.mobileNumber,
          password: hashedPassword,
          farmerId: saao.id,
          roleId: 4,
        });
        createdUsers.push(user);
      }
    }

    return res.status(201).json({
      message: `${createdUsers.length} user(s) created from today's SAAOs.`,
      users: createdUsers,
    });

  } catch (error) {
    console.error("Error creating SAAO users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};