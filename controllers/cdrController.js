
import { Op } from 'sequelize';
import CdrData from '../models/CdrData.js';

export const getFilteredCdr = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      destination = '',
      status = '',
      startDate = '',
      endDate = '',
      source = '',
      location = '',
      problem = '',
    } = req.query;

    const where = {};

    if (destination) {
      where.destination = { [Op.like]: `%${destination}%` };
    }

    if (status) {
      where.status = { [Op.like]: `%${status}%` };
    }

    if (source) {
      where.source = { [Op.like]: `%${source}%` };
    }

    if (location) {
      where.address = { [Op.like]: `%${location}%` };
    }

    if (problem) {
      where.user_field = { [Op.like]: `%${problem}%` };
    }

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    } else if (startDate) {
      where.date = {
        [Op.gte]: new Date(startDate),
      };
    } else if (endDate) {
      where.date = {
        [Op.lte]: new Date(endDate),
      };
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await CdrData.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['date', 'DESC']],
    });

    res.json({
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('❌ Error fetching filtered CDR data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



export const updateCdrField = async (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;

  try {
    const cdr = await CdrData.findByPk(id);
    if (!cdr) return res.status(404).json({ message: 'CDR not found' });

    if (name !== undefined) cdr.name = name;
    if (address !== undefined) cdr.address = address;

    await cdr.save();
    res.json({ message: 'Updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
