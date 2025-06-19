import bcrypt from "bcrypt";
import User from "../models/user.js";
import Farmer from "../models/RegistedUser.js";
import { Op } from "sequelize";
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
  const { mobileNumber, password } = req.body;

  try {
    const user = await User.findOne({ where: { mobileNumber } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user });
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