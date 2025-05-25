// controllers/deviceController.js
import Device from '../models/device.js'; // Your Device model
import RegistedUser from '../models/RegistedUser.js';

export const createDevice = async (req, res) => {
  try {
    const { name, deviceId, farmerId } = req.body;

    // Optional: check if RegistedUser exists
    const user = await RegistedUser.findByPk(farmerId);
    if (!user) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    const newDevice = await Device.create({ name, deviceId, farmerId });
    res.status(201).json(newDevice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllDevices = async (req, res) => {
  try {
    const devices = await Device.findAll({
      include: {
        model: RegistedUser,
        attributes: ['id', 'name'] // Adjust based on your RegistedUser fields
      }
    });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDeviceById = async (req, res) => {
  try {
    const { id } = req.params;
    const device = await Device.findByPk(id, {
      include: RegistedUser
    });

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    res.json(device);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, deviceId, farmerId } = req.body;

    const device = await Device.findByPk(id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Optional: verify farmerId belongs to a user
    if (farmerId) {
      const user = await RegistedUser.findByPk(farmerId);
      if (!user) {
        return res.status(404).json({ message: 'Farmer not found' });
      }
    }

    await device.update({ name, deviceId, farmerId });
    res.json(device);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const device = await Device.findByPk(id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    await device.destroy();
    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
