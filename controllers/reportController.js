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
        const counts = await User.findAll({
            attributes: [
                'id',
                'name',
                'role',
                'mobileNumber',
                [fn('COUNT', col('Farmers.id')), 'farmerCount'],

                // 📍 Add distinct location info using GROUP_CONCAT
                [literal('GROUP_CONCAT(DISTINCT Farmers.region)'), 'region'],
                [literal('GROUP_CONCAT(DISTINCT Farmers.block)'), 'block'],
                [literal('GROUP_CONCAT(DISTINCT Farmers.union)'), 'union'],
                [literal('GROUP_CONCAT(DISTINCT Farmers.upazila)'), 'upazila'],
                [literal('GROUP_CONCAT(DISTINCT Farmers.district)'), 'district'],
                [literal('GROUP_CONCAT(DISTINCT Farmers.division)'), 'division'],
                [literal('GROUP_CONCAT(DISTINCT Farmers.hotspot)'), 'hotspot'],
            ],
            include: [
                {
                    model: RegistedUser,
                    as: 'Farmers',
                    attributes: [],
                    where: { role: 'farmer' },
                    required: false,
                },
            ],
            where: { role: 'SAAO' },
            group: ['User.id'],
            raw: true,
        });

        const result = counts.map(item => ({
            id: item.id,
            name: item.name,
            role: item.role,
            mobileNumber: item.mobileNumber,
            farmerCount: parseInt(item.farmerCount) || 0,
            region: item.region || '',
            block: item.block || '',
            union: item.union || '',
            upazila: item.upazila || '',
            district: item.district || '',
            division: item.division || '',
            hotspot: item.hotspot || '',
        }));

        const totalFarmerCount = result.reduce((sum, item) => sum + item.farmerCount, 0);

        res.status(200).json({
            success: true,
            data: result,
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