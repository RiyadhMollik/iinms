import db from "../config/db.js";

export const getWaterLevelStats = async (req, res) => {
    const { startTime, endTime ,device } = req.query;
    try {
        const queryLast20 = `
            SELECT 
                dataInputdate AS date,
                MIN(water_level) AS min_water_level,
                MAX(water_level) AS max_water_level
            FROM \`${device}\`
            GROUP BY dataInputdate
            ORDER BY dataInputdate DESC
            LIMIT 10;
        `;

        let query = `
            SELECT 
                \`timestamp\`,
                water_level
            FROM \`${device}\`
            ORDER BY \`timestamp\` DESC
            LIMIT 20;
        `;
        // Convert local time to UTC
        const start = startTime ? new Date(startTime).toISOString() : null;  // UTC time
        const end = endTime ? new Date(endTime).toISOString() : null;        // UTC time

        console.log("Start Date (UTC):", start);
        console.log("End Date (UTC):", end);
        
        if (start && end) {
            query = `
                SELECT 
                    \`timestamp\`,
                    water_level
                FROM \`${device}\`
                WHERE \`timestamp\` BETWEEN ? AND ?
                ORDER BY \`timestamp\` DESC
                LIMIT 20;
            `;
        }

        const [last20Results] = await db.query(query, { replacements: [start, end] });
        const [avgResult] = await db.query(queryLast20);

        res.json({
            last20: last20Results,
            average: avgResult
        });

    } catch (error) {
        console.error("Error fetching water level data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const getWaterLevelStatstest = async (req, res) => {
    try {
        const queryLast20 = `
            SELECT 
                dataInputdate AS date,
                MIN(water_level) AS min_water_level,
                MAX(water_level) AS max_water_level
            FROM \`1100012410150003\`
            GROUP BY dataInputdate
            ORDER BY dataInputdate DESC
            LIMIT 10;
        `;

        const query = `
            SELECT 
                \`timestamp\`,
                water_level
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
        console.error("Error fetching water level data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
