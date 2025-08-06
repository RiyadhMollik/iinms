import WABASValidationData from '../models/WABASValidationData.js';
import RegistedUser from '../models/RegistedUser.js';
import User from '../models/user.js';
import { Op } from 'sequelize';

// Create
export const createWABASValidationData = async (req, res) => {
  try {
    const { farmerId, saaoId, formData } = req.body;

    if (!farmerId || !saaoId) {
      return res.status(400).json({ success: false, message: 'Farmer ID and SAAO ID are required' });
    }

    const existingData = await WABASValidationData.findOne({ where: { farmerId, saaoId } });
    if (existingData) {
      return res.status(400).json({ success: false, message: 'Data already exists for this farmer and SAAO' });
    }

    const defaultFormData = {
      0: { irrigation: [], other: {} },
      1: { other: {} },
      2: { other: {} },
      3: { herbicide: [], other: {} },
      4: { other: {} },
      5: { fertilizer: [], other: {} },
      6: { other: {} },
      7: { pesticide: [], other: {} },
      8: { fungicide: [], other: {} },
      9: { other: {} },
      10: { other: {} },
      11: { other: {} }
    };

    const newData = await WABASValidationData.create({
      farmerId,
      saaoId,
      formData: formData || defaultFormData
    });

    res.status(201).json({ success: true, message: 'Data created successfully', data: newData });

  } catch (error) {
    console.error('Error creating data:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Get by farmerId and saaoId
export const getWABASValidationData = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { saaoId } = req.query;

    if (!farmerId || !saaoId) {
      return res.status(400).json({ success: false, message: 'Farmer ID and SAAO ID are required' });
    }

    const data = await WABASValidationData.findOne({ where: { farmerId, saaoId } });
    if (!data) {
      return res.status(404).json({ success: false, message: 'Data not found' });
    }

    res.status(200).json({ success: true, data });

  } catch (error) {
    console.error('Error getting data:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Update
export const updateWABASValidationData = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { saaoId, formData } = req.body;

    if (!farmerId || !saaoId || !formData) {
      return res.status(400).json({ success: false, message: 'Farmer ID, SAAO ID, and form data are required' });
    }

    const data = await WABASValidationData.findOne({ where: { farmerId, saaoId } });
    if (!data) {
      return res.status(404).json({ success: false, message: 'Data not found' });
    }

    await data.update({ formData, updatedAt: new Date() });

    res.status(200).json({ success: true, message: 'Data updated successfully', data });

  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Get all by saaoId
export const getAllFarmerDataBySaao = async (req, res) => {
  try {
    const { saaoId } = req.params;

    if (!saaoId) {
      return res.status(400).json({
        success: false,
        message: 'SAAO ID is required'
      });
    }

    const farmerDataList = await WABASValidationData.findAll({
      where: {
        saaoId
      },
      include: [
        {
          model: RegistedUser,
          as: 'farmer',
          attributes: ['id', 'name', 'mobileNumber', 'village'],
          foreignKey: 'farmerId'
        }
      ],
      order: [['updatedAt', 'DESC']]
    });

    // Transform data to include farmer information
    const transformedData = farmerDataList.map(item => ({
      id: item.id,
      farmerId: item.farmerId,
      saaoId: item.saaoId,
      farmerName: item.farmer?.name || `Farmer ${item.farmerId}`,
      phone: item.farmer?.mobileNumber || '',
      village: item.farmer?.village || '',
      formData: item.formData,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    res.status(200).json({
      success: true,
      message: 'Farmer data list retrieved successfully',
      data: transformedData,
      count: transformedData.length
    });

  } catch (error) {
    console.error('Error getting all farmer data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete
export const deleteWABASValidationData = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { saaoId } = req.query;

    if (!farmerId || !saaoId) {
      return res.status(400).json({ success: false, message: 'Farmer ID and SAAO ID are required' });
    }

    const deleted = await WABASValidationData.destroy({ where: { farmerId, saaoId } });

    if (deleted === 0) {
      return res.status(404).json({ success: false, message: 'Data not found' });
    }

    res.status(200).json({ success: true, message: 'Data deleted successfully' });

  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const getAllWABASValidationDataBySaao = async (req, res) => {
  try {
    const { saaoId } = req.params;

    if (!saaoId) {
      return res.status(400).json({ success: false, message: 'SAAO ID is required' });
    }

    const list = await WABASValidationData.findAll({
      where: { saaoId },
      include: [
        {
          model: RegistedUser,
          as: 'farmer',
          attributes: ['id', 'name', 'mobileNumber', 'village'],
          foreignKey: 'farmerId'
        }
      ],
      order: [['updatedAt', 'DESC']]
    });

    // Transform data to include farmer information
    const transformedData = list.map(item => ({
      id: item.id,
      farmerId: item.farmerId,
      saaoId: item.saaoId,
      farmerName: item.farmer?.name || `Farmer ${item.farmerId}`,
      phone: item.farmer?.mobileNumber || '',
      village: item.farmer?.village || '',
      formData: item.formData,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    res.status(200).json({ success: true, data: transformedData, count: transformedData.length });

  } catch (error) {
    console.error('Error fetching list:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const getUserReportData = async (req, res) => {
  try {
    const {
      startDate = '',
      endDate = '',
      saaoId = '',
      limit = 1000
    } = req.query;

    const where = {};

    if (saaoId && saaoId !== 'all') {
      where.saaoId = saaoId;
    }

    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    } else if (startDate) {
      where.createdAt = {
        [Op.gte]: new Date(startDate),
      };
    } else if (endDate) {
      where.createdAt = {
        [Op.lte]: new Date(endDate),
      };
    }

    const userData = await WABASValidationData.findAll({
      where,
      include: [
        {
          model: RegistedUser,
          as: 'farmer',
          attributes: ['id', 'name', 'mobileNumber', 'village'],
          foreignKey: 'farmerId'
        }
      ],
      limit: parseInt(limit),
      order: [['updatedAt', 'DESC']]
    });

    // Transform data to include farmer information
    const transformedData = userData.map(item => ({
      id: item.id,
      farmerId: item.farmerId,
      saaoId: item.saaoId,
      farmerName: item.farmer?.name || `Farmer ${item.farmerId}`,
      phone: item.farmer?.mobileNumber || '',
      village: item.farmer?.village || '',
      formData: item.formData,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    res.json({
      success: true,
      data: transformedData,
      total: transformedData.length
    });
  } catch (error) {
    console.error('❌ Error fetching user report data:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal Server Error',
      error: error.message 
    });
  }
};

export const getSaaosForReport = async (req, res) => {
  try {
    // Get all users with SAAO role
    const saaos = await User.findAll({
      where: {
        role: 'SAAO'
      },
      attributes: ['id', 'name', 'mobileNumber'],
      order: [['name', 'ASC']]
    });

    const transformedSaaos = saaos.map(saao => ({
      id: saao.id,
      name: saao.name,
      phone: saao.mobileNumber
    }));

    res.json({
      success: true,
      data: transformedSaaos
    });
  } catch (error) {
    console.error('❌ Error fetching SAAOs:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal Server Error',
      error: error.message 
    });
  }
};