import AEZ from "../models/AEZ.js";
import District from "../models/District.js";
import Division from "../models/Division.js";
import Hotspot from "../models/Hotspot.js";
import Region from "../models/Region.js";
import Upazila from "../models/Upazila.js";
import Union from "../models/Union.js";
import Block from "../models/block.js";

export const getAllData = async (req, res) => {
    try {
        const [aez,  districts, divisions, hotspots, regions, upazilas, unions, blocks] = await Promise.all([
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
    const { hotspot} = req.query;
    const regions = await Block.findAll({
      attributes: ["region"],
      where: { hotspot },
      group: ["region"],
    });

    res.json(regions.map((item) => item.region));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get unique Divisions based on Region
export const getDivisionsByRegion = async (req, res) => {
  try {
    const { hotspot, region } = req.query;

    const divisions = await Block.findAll({
      attributes: ["division"],
      where: { hotspot,  region },
      group: ["division"],
    });

    res.json(divisions.map((item) => item.division));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get unique Districts based on Division
export const getDistrictsByDivision = async (req, res) => {
  try {
    const { hotspot,  region, division } = req.query;

    const districts = await Block.findAll({
      attributes: ["district"],
      where: { hotspot,  region, division },
      group: ["district"],
    });

    res.json(districts.map((item) => item.district));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get unique Upazilas based on District
export const getUpazilasByDistrict = async (req, res) => {
  try {
    const { hotspot,  region, division, district } = req.query;

    const upazilas = await Block.findAll({
      attributes: ["upazila"],
      where: { hotspot,  region, division, district },
      group: ["upazila"],
    });

    res.json(upazilas.map((item) => item.upazila));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get unique Unions based on Upazila
export const getUnionsByUpazila = async (req, res) => {
  try {
    const { hotspot,  region, division, district, upazila } = req.query;

    const unions = await Block.findAll({
      attributes: ["union"],
      where: { hotspot,  region, division, district, upazila },
      group: ["union"],
    });

    res.json(unions.map((item) => item.union));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get unique Blocks based on Union
export const getBlocksByUnion = async (req, res) => {
  try {
    const { hotspot,  region, division, district, upazila, union } = req.query;

    const blocks = await Block.findAll({
      attributes: ["block"],
      where: { hotspot,  region, division, district, upazila, union },
      group: ["block"],
    });

    res.json(blocks.map((item) => item.block));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  
