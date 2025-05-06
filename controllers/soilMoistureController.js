import db from "../config/db.js";

export const getSoilMoistureStats = async (req, res) => {
    try {
        const { startTime, endTime } = req.query;

        const queryLast20 = `
            SELECT 
                dataInputdate AS date,
                MIN(soil_moisture) AS min_soil_moisture,
                MAX(soil_moisture) AS max_soil_moisture
            FROM \`1100012410150002\`
            GROUP BY dataInputdate
            ORDER BY dataInputdate DESC
            LIMIT 10;
        `;

        let query = `
            SELECT 
                \`timestamp\`,
                soil_moisture
            FROM \`1100012410150002\`
            ORDER BY \`timestamp\` DESC
            LIMIT 20;
        `;

        const start = startTime ? new Date(startTime) : null;
        const end = endTime ? new Date(endTime) : null;

        if (start && end) {
            query = `
                SELECT 
                    \`timestamp\`,
                    soil_moisture
                FROM \`1100012410150002\`
                WHERE \`timestamp\` BETWEEN ? AND ?
                ORDER BY \`timestamp\` DESC
                LIMIT 20;
            `;
        }

        // Check if start and end are valid date objects
        console.log("Start Date:", start);
        console.log("End Date:", end);

        // Pass parameters only if both start and end are defined
        const parameters = (start && end) ? [start, end] : [];

        // Execute the query with parameters
        const [last20Results] = await db.query(query, { replacements: parameters });
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
