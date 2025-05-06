import db from "../config/db.js";

export const getSoilMoistureStats = async (req, res) => {
    try {
        const { startTime, endTime } = req.query;

        // Base query for the last 20 results
        const query = `
            SELECT 
                \`timestamp\`,
                soil_moisture
            FROM \`1100012410150002\`
            ${startTime && endTime ? `WHERE \`timestamp\` BETWEEN ? AND ?` : ''}
            ORDER BY \`timestamp\` DESC
            LIMIT 20;
        `;

        // Base query for the average values
        const queryLast20 = `
            SELECT 
                dataInputdate AS date,
                MIN(soil_moisture) AS min_soil_moisture,
                MAX(soil_moisture) AS max_soil_moisture
            FROM \`1100012410150002\`
            ${startTime && endTime ? `WHERE dataInputdate BETWEEN ? AND ?` : ''}
            GROUP BY dataInputdate
            ORDER BY dataInputdate DESC
            LIMIT 10;
        `;

        // Check if startTime and endTime are provided, format them as Date objects
        const start = startTime ? new Date(startTime) : null;
        const end = endTime ? new Date(endTime) : null;

        const params = [];
        if (start && end) {
            // Format dates as needed for SQL query
            params.push(start.toISOString().slice(0, 19).replace('T', ' ')); // Format to 'YYYY-MM-DD HH:MM:SS'
            params.push(end.toISOString().slice(0, 19).replace('T', ' '));   // Format to 'YYYY-MM-DD HH:MM:SS'
        }

        // Fetch the last 20 data points and the average data within the given time range if provided
        const [last20Results] = await db.query(query, params);
        const [avgResult] = await db.query(queryLast20, params);

        res.json({
            last20: last20Results,
            average: avgResult
        });

    } catch (error) {
        console.error("Error fetching soil moisture data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getSoilMoistureStatsTest = async (req, res) => {
    try {
        const queryLast20 = `
            SELECT 
                dataInputdate AS date,
                MIN(soil_moisture) AS min_soil_moisture,
                MAX(soil_moisture) AS max_soil_moisture
            FROM \`1100012410150003\`
            GROUP BY dataInputdate
            ORDER BY dataInputdate DESC
            LIMIT 10;
        `;

        const query = `
            SELECT 
                \`timestamp\`,
                soil_moisture
            FROM \`1100012410150003\`
            ORDER BY \`timestamp\` DESC
            LIMIT 20;
        `;

        const [last20Results] = await db.query(query);
        const [avgResult] = await db.query(queryLast20);

        res.json({
            last20: last20Results,
            average: avgResult
        });

    } catch (error) {
        console.error("Error fetching soil moisture data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
