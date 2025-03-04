import db from "../config/db.js";

export const getSoilMoistureStats = async (req, res) => {
    try {
        const query = `
          SELECT 
        \`date\`,
        AVG(soil_moisture) AS avg_soil_moisture,
        MIN(soil_moisture) AS min,
        MAX(soil_moisture) AS max
    FROM \`1100012410150002\`
    GROUP BY \`date\`
    ORDER BY \`date\` DESC;
        `;

        const [results] = await db.query(query);
        res.json(results);

    } catch (error) {
        console.error("Error fetching soil moisture data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
