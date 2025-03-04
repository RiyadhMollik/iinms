import db from "../config/db.js";

export const getTemperatureStats = async (req, res) => {
    try {
        const query = `
            SELECT 
                \`date\`,
                AVG(temperature) AS avg_temperature, 
                MIN(temperature) AS min, 
                MAX(temperature) AS max
            FROM \`1100012410150002\`
            GROUP BY \`date\`
            ORDER BY \`date\` DESC;
        `;

        const [results] = await db.query(query);
        res.json(results);

    } catch (error) {
        console.error("Error fetching temperature data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
