import AEZ from "../models/AEZ.js";
import CSA from "../models/CSA.js";
import District from "../models/District.js";
import Division from "../models/Division.js";
import Hotspot from "../models/Hotspot.js";
import Region from "../models/Region.js";
import Upazila from "../models/Upazila.js";
import Union from "../models/Union.js";
import Block from "../models/block.js";

export const getAllData = async (req, res) => {
    try {
        const [aez, csa, districts, divisions, hotspots, regions, upazilas, unions, blocks] = await Promise.all([
            AEZ.findAll(),
            CSA.findAll(),
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
            csa,
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

export const getFilterOptions = async (req, res) => {
  try {
    const { filterBy, value } = req.query;

    if (!filterBy) {
      return res.status(400).json({ error: "Missing filterBy parameter" });
    }

    let nextFilter;
    let whereCondition = {};  

    switch (filterBy) {
      case "Hotspot":
        nextFilter = "hotspot";
        break;
      case "CSA":
        nextFilter = "csa";
        if (value) whereCondition = { hotspot: value };
        break;
      case "Region":
        nextFilter = "region";
        if (value) whereCondition = { csa: value };
        break;
      case "Division":
        nextFilter = "division";
        if (value) whereCondition = { region: value };
        break;
      case "District":
        nextFilter = "district";
        if (value) whereCondition = { division: value };
        break;
      case "Upazila":
        nextFilter = "upazila";
        if (value) whereCondition = { district: value };
        break;
      case "Union":
        nextFilter = "union";
        if (value) whereCondition = { upazila: value };
        break;
      case "Block":
        nextFilter = "block";
        if (value) whereCondition = { union: value };
        break;
      default:
        return res.status(400).json({ error: "Invalid filter selection" });
    }

    // Fetch unique values based on filter
    const data = await Block.findAll({
      attributes: [[Block.sequelize.fn("DISTINCT", Block.sequelize.col(nextFilter)), nextFilter]],
      where: Object.keys(whereCondition).length ? whereCondition : undefined, // Only apply filter if value exists
    });

    const filteredData = data.map((item) => item[nextFilter]).filter(Boolean);

    res.json(filteredData.length > 0 ? filteredData : []);
  } catch (error) {
    console.error("Error fetching filter options:", error);
    res.status(500).json({ error: "Server error" });
  }
};

  
