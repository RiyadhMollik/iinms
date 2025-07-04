import RegistedUser from "../models/RegistedUser.js";
import User from '../models/user.js';
import sequelize from "../config/db.js";
import { Op, fn, col, literal } from 'sequelize';
export const getLocationCounts = async (req, res) => {
  try {
    const { date, locationType } = req.query;

    // Validate locationType
    const validLocationTypes = ['upazila', 'district', 'division', 'region', 'hotspot'];
    if (!validLocationTypes.includes(locationType)) {
      return res.status(400).json({ error: 'Invalid location type' });
    }

    // Parse and validate date
    let startDate, endDate;
    if (date) {
      startDate = new Date(date);
      endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1); // Include entire day

      if (isNaN(startDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }
    }

    // Build where clause for date and role
    const whereClause = {
      role: 'farmer', // Filter for farmer role
      ...(date && {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate
        }
      })
    };

    // Query to get counts grouped by locationType
    const counts = await RegistedUser.findAll({
      attributes: [
        locationType,
        [sequelize.fn('COUNT', sequelize.col(locationType)), 'count']
      ],
      where: whereClause,
      group: [locationType],
      raw: true
    });

    // Format response
    const result = counts.map(item => ({
      [locationType]: item[locationType] || 'Unknown',
      count: parseInt(item.count)
    }));

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching location counts:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};


export const getBlockCounts = async (req, res) => {
  try {
    const { date, upazila, union, hotspots } = req.query;

    // Validate inputs
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }
    if (!upazila && !union) {
      return res.status(400).json({ error: 'Upazila or Union is required' });
    }

    // Parse and validate date
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1); // Include entire day
    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    // Build where clause
    const whereClause = {
      role: 'farmer',
      createdAt: {
        [Op.gte]: startDate,
        [Op.lt]: endDate,
      },
    };

    // Add upazila or union filter
    if (union) {
      whereClause.union = union;
    } else if (upazila) {
      whereClause.upazila = upazila;
    }

    // Add hotspot filter if provided
    if (hotspots) {
      const hotspotArray = hotspots.split(',');
      whereClause.hotspot = {
        [Op.in]: hotspotArray,
      };
    }

    // Query to get block counts
    const counts = await RegistedUser.findAll({
      attributes: [
        'block',
        [sequelize.fn('COUNT', sequelize.col('block')), 'count'],
      ],
      where: whereClause,
      group: ['block'],
      raw: true,
    });

    // Format response
    const result = counts.map(item => ({
      block: item.block || 'Unknown',
      count: parseInt(item.count),
    }));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching block counts:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getSaaoUserCounts = async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT 
        u.id,
        u.name,
        u.role,
        u.mobileNumber,
        COUNT(r.id) AS farmerCount,
        GROUP_CONCAT(DISTINCT r.region) AS region,
        GROUP_CONCAT(DISTINCT r.block) AS block,
        GROUP_CONCAT(DISTINCT r.union) AS \`union\`,
        GROUP_CONCAT(DISTINCT r.upazila) AS upazila,
        GROUP_CONCAT(DISTINCT r.district) AS district,
        GROUP_CONCAT(DISTINCT r.division) AS division,
        GROUP_CONCAT(DISTINCT r.hotspot) AS hotspot
      FROM Users u
      LEFT JOIN RegistedUsers r ON r.saaoId = u.id AND r.role = 'farmer'
      WHERE u.role = 'SAAO'
      GROUP BY u.id
    `);

    const totalFarmerCount = results.reduce((sum, row) => sum + Number(row.farmerCount), 0);

    res.status(200).json({
      success: true,
      data: results,
      totalFarmerCount,
    });
  } catch (error) {
    console.error('Error fetching SAAO user counts:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};


export const assignSaaosToFarmers = async (req, res) => {
  try {
    const unassignedFarmers = await RegistedUser.findAll({
      where: {
        role: 'farmer',
        saaoId: null,
      },
    });

    let updatedCount = 0;

    for (const farmer of unassignedFarmers) {
      if (!farmer.block) continue;

      // Step 1: Find SAAO from RegistedUser
      const saaoRegisted = await RegistedUser.findOne({
        where: {
          role: 'SAAO',
          block: farmer.block,
        },
      });

      if (!saaoRegisted) continue;

      // Step 2: Find corresponding User whose farmerId = saaoRegisted.id
      const saaoUser = await User.findOne({
        where: {
          farmerId: saaoRegisted.id,
        },
      });

      if (!saaoUser) continue;

      // Step 3: Update farmer with User ID and name
      await farmer.update({
        saaoId: saaoUser.id,
        saaoName: saaoUser.name,
      });

      updatedCount++;
    }

    return res.status(200).json({
      success: true,
      message: `✅ Assigned ${updatedCount} farmers to SAAOs.`,
    });
  } catch (error) {
    console.error('❌ Error assigning SAAOs to farmers:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};