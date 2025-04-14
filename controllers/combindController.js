import AEZ from "../models/AEZ.js";
import District from "../models/District.js";
import Division from "../models/Division.js";
import Hotspot from "../models/Hotspot.js";
import Region from "../models/Region.js";
import Upazila from "../models/Upazila.js";
import Union from "../models/Union.js";
import Block from "../models/block.js";
import { Op } from 'sequelize';

export const getAllData = async (req, res) => {
  try {
    const [aez, districts, divisions, hotspots, regions, upazilas, unions, blocks] = await Promise.all([
      AEZ.findAll(),
      District.findAll(),
      Division.findAll(),
      Hotspot.findAll(),
      Region.findAll(),
      Upazila.findAll(),
      Union.findAll(),
      Block.findAll(),
    ]);

    res.json({
      aez,
      districts,
      divisions,
      hotspots,
      regions,
      upazilas,
      unions,
      blocks,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getHotspots = async (req, res) => {
  try {
    const hotspots = await Block.findAll({
      attributes: ["hotspot"],
      group: ["hotspot"],
    });

    res.json(hotspots.map((item) => item.hotspot));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get unique CSA based on selected Hotspot
export const getCSAByHotspot = async (req, res) => {
  try {
    const { hotspot } = req.query;

    const csaList = await Block.findAll({
      attributes: ["csa"],
      where: { hotspot },
      group: ["csa"],
    });

    res.json(csaList.map((item) => item.csa));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get unique Regions based on Hotspot and CSA
export const getRegionsByCSA = async (req, res) => {
  try {
    let { hotspot } = req.query;

    // Handle comma-separated or array inputs
    if (typeof hotspot === "string") {
      hotspot = hotspot.split(",").map((s) => s.trim());
    } else if (!Array.isArray(hotspot)) {
      hotspot = [];
    }

    const whereClause = hotspot.length
      ? { hotspot: { [Op.in]: hotspot } }
      : {};

    const regions = await Block.findAll({
      attributes: ["region"],
      where: whereClause,
      group: ["region"],
    });

    const result = regions
      .map((item) => item.region)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get unique Divisions based on Region
export const getDivisionsByRegion = async (req, res) => {
  try {
    let { hotspot, region } = req.query;

    // Normalize hotspot
    if (typeof hotspot === "string") {
      hotspot = hotspot.split(",").map((s) => s.trim());
    } else if (!Array.isArray(hotspot)) {
      hotspot = [];
    }

    // Normalize region
    if (typeof region === "string") {
      region = region.split(",").map((s) => s.trim());
    } else if (!Array.isArray(region)) {
      region = [];
    }

    // Build where clause conditionally
    const whereClause = {};
    if (hotspot.length) {
      whereClause.hotspot = { [Op.in]: hotspot };
    }
    if (region.length) {
      whereClause.region = { [Op.in]: region };
    }

    const divisions = await Block.findAll({
      attributes: ["division"],
      where: whereClause,
      group: ["division"],
    });

    const result = divisions
      .map((item) => item.division)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get unique Districts based on Division
export const getDistrictsByDivision = async (req, res) => {
  try {
    let { hotspot, region, division } = req.query;

    // Normalize hotspot
    if (typeof hotspot === "string") {
      hotspot = hotspot.split(",").map((s) => s.trim());
    } else if (!Array.isArray(hotspot)) {
      hotspot = [];
    }

    // Normalize region
    if (typeof region === "string") {
      region = region.split(",").map((s) => s.trim());
    } else if (!Array.isArray(region)) {
      region = [];
    }

    // Normalize division
    if (typeof division === "string") {
      division = division.split(",").map((s) => s.trim());
    } else if (!Array.isArray(division)) {
      division = [];
    }

    // Build the where clause
    const whereClause = {};
    if (hotspot.length) {
      whereClause.hotspot = { [Op.in]: hotspot };
    }
    if (region.length) {
      whereClause.region = { [Op.in]: region };
    }
    if (division.length) {
      whereClause.division = { [Op.in]: division };
    }

    const districts = await Block.findAll({
      attributes: ["district"],
      where: whereClause,
      group: ["district"],
    });

    const result = districts
      .map((item) => item.district)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get unique Upazilas based on District
export const getUpazilasByDistrict = async (req, res) => {
  try {
    let { hotspot, region, division, district } = req.query;

    // Normalize inputs
    if (typeof hotspot === "string") {
      hotspot = hotspot.split(",").map((s) => s.trim());
    } else if (!Array.isArray(hotspot)) {
      hotspot = [];
    }

    if (typeof region === "string") {
      region = region.split(",").map((s) => s.trim());
    } else if (!Array.isArray(region)) {
      region = [];
    }

    if (typeof division === "string") {
      division = division.split(",").map((s) => s.trim());
    } else if (!Array.isArray(division)) {
      division = [];
    }

    if (typeof district === "string") {
      district = district.split(",").map((s) => s.trim());
    } else if (!Array.isArray(district)) {
      district = [];
    }

    // Build dynamic where clause
    const whereClause = {};
    if (hotspot.length) {
      whereClause.hotspot = { [Op.in]: hotspot };
    }
    if (region.length) {
      whereClause.region = { [Op.in]: region };
    }
    if (division.length) {
      whereClause.division = { [Op.in]: division };
    }
    if (district.length) {
      whereClause.district = { [Op.in]: district };
    }

    const upazilas = await Block.findAll({
      attributes: ["upazila"],
      where: whereClause,
      group: ["upazila"],
    });

    const result = upazilas
      .map((item) => item.upazila)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get unique Unions based on Upazila
export const getUnionsByUpazila = async (req, res) => {
  try {
    let { hotspot, region, division, district, upazila } = req.query;

    // Normalize each filter
    if (typeof hotspot === "string") {
      hotspot = hotspot.split(",").map((s) => s.trim());
    } else if (!Array.isArray(hotspot)) {
      hotspot = [];
    }

    if (typeof region === "string") {
      region = region.split(",").map((s) => s.trim());
    } else if (!Array.isArray(region)) {
      region = [];
    }

    if (typeof division === "string") {
      division = division.split(",").map((s) => s.trim());
    } else if (!Array.isArray(division)) {
      division = [];
    }

    if (typeof district === "string") {
      district = district.split(",").map((s) => s.trim());
    } else if (!Array.isArray(district)) {
      district = [];
    }

    if (typeof upazila === "string") {
      upazila = upazila.split(",").map((s) => s.trim());
    } else if (!Array.isArray(upazila)) {
      upazila = [];
    }

    // Build the WHERE clause
    const whereClause = {};
    if (hotspot.length) {
      whereClause.hotspot = { [Op.in]: hotspot };
    }
    if (region.length) {
      whereClause.region = { [Op.in]: region };
    }
    if (division.length) {
      whereClause.division = { [Op.in]: division };
    }
    if (district.length) {
      whereClause.district = { [Op.in]: district };
    }
    if (upazila.length) {
      whereClause.upazila = { [Op.in]: upazila };
    }

    const unions = await Block.findAll({
      attributes: ["union"],
      where: whereClause,
      group: ["union"],
    });

    const result = unions
      .map((item) => item.union)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get unique Blocks based on Union
export const getBlocksByUnion = async (req, res) => {
  try {
    let { hotspot, region, division, district, upazila, union } = req.query;

    // Normalize query params into arrays
    const normalize = (value) => {
      if (typeof value === "string") return value.split(",").map((v) => v.trim());
      if (Array.isArray(value)) return value;
      return [];
    };

    hotspot = normalize(hotspot);
    region = normalize(region);
    division = normalize(division);
    district = normalize(district);
    upazila = normalize(upazila);
    union = normalize(union);

    // Build dynamic WHERE clause
    const whereClause = {};
    if (hotspot.length) whereClause.hotspot = { [Op.in]: hotspot };
    if (region.length) whereClause.region = { [Op.in]: region };
    if (division.length) whereClause.division = { [Op.in]: division };
    if (district.length) whereClause.district = { [Op.in]: district };
    if (upazila.length) whereClause.upazila = { [Op.in]: upazila };
    if (union.length) whereClause.union = { [Op.in]: union };

    const blocks = await Block.findAll({
      attributes: ["block"],
      where: whereClause,
      group: ["block"],
    });

    const result = blocks
      .map((item) => item.block)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

