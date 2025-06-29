import RegistedUser from "../models/RegistedUser.js";
import sequelize from "../config/db.js";
import { Op } from 'sequelize';
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