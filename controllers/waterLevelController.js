import db from "../config/db.js";

export const getWaterLevelStats = async (req, res) => {
    try {
        const query = `
            SELECT 
    date,
    AVG(water_level) AS avg_water_level, 
    MIN(water_level) AS min, 
    MAX(water_level) AS max
  FROM \`1100012410150002\`
  GROUP BY date
  ORDER BY date DESC;
        `;

        const [results] = await db.query(query);
        res.json(results);

    } catch (error) {
        console.error("Error fetching water level data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
