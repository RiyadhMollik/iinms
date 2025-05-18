// controllers/farmerController.js
import Farmer from "../models/RegistedUser.js";
import sequelize from "../config/db.js";
// Create a new farmer
export const createFarmer = async (req, res) => {

  console.log(req.body);
  try {
    const farmer = await Farmer.create(req.body);
    res.status(201).json(farmer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get all farmers
export const getFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.findAll();
    res.status(200).json(farmers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a farmer by ID
export const getFarmerById = async (req, res) => {
  try {
    const farmer = await Farmer.findByPk(req.params.id);
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }
    res.status(200).json(farmer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a farmer
export const updateFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByPk(req.params.id);
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }
    await farmer.update(req.body);
    res.status(200).json(farmer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a farmer
export const deleteFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByPk(req.params.id);
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }
    await farmer.destroy();
    res.status(200).json({ message: "Farmer deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getFarmersByRole = async (req, res) => {
  try {
    const { saaoId } = req.query;
    const { role } = req.params;
    const { page = 1, limit = 10 } = req.query;
    console.log(saaoId , role);
    
    const offset = (page - 1) * limit;
    const parsedLimit = parseInt(limit, 10);
    const whereClause = { role };
    if (saaoId !== null) {
      whereClause.saaoId = saaoId; // or parseInt(saaoId, 10) if you want strict typing
    }
    console.log(whereClause , 'whereClause');
    
    const farmers = await Farmer.findAll({
      where: whereClause,
      limit: parsedLimit,
      offset: offset,
    });

    if (farmers.length === 0) {
      return res.status(404).json({ message: "No farmers found with this role" });
    }
    const totalFarmers = await Farmer.count({ where: whereClause });
    const totalPages = Math.ceil(totalFarmers / parsedLimit);
    res.status(200).json({
      data: farmers,
      pagination: {
        currentPage: page,
        totalPages,
        totalFarmers,
        limit: parsedLimit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getStatsBySaaoId = async (req, res) => {
  try {
    const { saaoId } = req.params;

    // Check if saaoId is provided
    if (!saaoId) {
      return res.status(400).json({ error: 'saaoId is required' });
    }

    // Query the database to get the total count of entries per day for the given saaoId
    const stats = await Farmer.findAll({
      where: {
        saaoId: saaoId,
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'], // Extract date from createdAt
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalEntries'], // Count the number of records
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))], // Group by the date part of createdAt
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']], // Order by date ascending
    });

    // If no records found, return an empty array
    if (!stats.length) {
      return res.status(404).json({ message: 'No data found for the provided saaoId.' });
    }

    // Return the stats in the response
    return res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ error: 'An error occurred while fetching stats.' });
  }
};