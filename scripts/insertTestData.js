import sequelize from '../config/db.js';
import ResearchMeasures from '../models/ResearchMeasures.js';

const testData = [
    // BBRRI HQ Gazipur - Temperature data for last 7 days
    {
        station_id: 'BBRRI_HQ_GAZIPUR',
        station_name: 'BBRRI HQ Gazipur',
        state: 'Active',
        type: 'Weather Station',
        network: 'BRRI Network',
        owner: 'BRRI',
        power_save: 'Enabled',
        latest_data: '2025-01-15 10:30:00',
        measure: 'Temperature',
        last_value: 25.5,
        trend: 'Rising',
        delta_h: 0.5,
        unit: '°C',
        date_value: '2025-01-15 10:30:00',
        alarm: 'Normal'
    },
    {
        station_id: 'BBRRI_HQ_GAZIPUR',
        station_name: 'BBRRI HQ Gazipur',
        state: 'Active',
        type: 'Weather Station',
        network: 'BRRI Network',
        owner: 'BRRI',
        power_save: 'Enabled',
        latest_data: '2025-01-14 10:30:00',
        measure: 'Temperature',
        last_value: 24.8,
        trend: 'Rising',
        delta_h: 0.3,
        unit: '°C',
        date_value: '2025-01-14 10:30:00',
        alarm: 'Normal'
    },
    {
        station_id: 'BBRRI_HQ_GAZIPUR',
        station_name: 'BBRRI HQ Gazipur',
        state: 'Active',
        type: 'Weather Station',
        network: 'BRRI Network',
        owner: 'BRRI',
        power_save: 'Enabled',
        latest_data: '2025-01-13 10:30:00',
        measure: 'Temperature',
        last_value: 26.2,
        trend: 'Falling',
        delta_h: -0.7,
        unit: '°C',
        date_value: '2025-01-13 10:30:00',
        alarm: 'Normal'
    },
    {
        station_id: 'BBRRI_HQ_GAZIPUR',
        station_name: 'BBRRI HQ Gazipur',
        state: 'Active',
        type: 'Weather Station',
        network: 'BRRI Network',
        owner: 'BRRI',
        power_save: 'Enabled',
        latest_data: '2025-01-12 10:30:00',
        measure: 'Temperature',
        last_value: 27.1,
        trend: 'Rising',
        delta_h: 0.9,
        unit: '°C',
        date_value: '2025-01-12 10:30:00',
        alarm: 'Normal'
    },
    {
        station_id: 'BBRRI_HQ_GAZIPUR',
        station_name: 'BBRRI HQ Gazipur',
        state: 'Active',
        type: 'Weather Station',
        network: 'BRRI Network',
        owner: 'BRRI',
        power_save: 'Enabled',
        latest_data: '2025-01-11 10:30:00',
        measure: 'Temperature',
        last_value: 25.3,
        trend: 'Stable',
        delta_h: 0.0,
        unit: '°C',
        date_value: '2025-01-11 10:30:00',
        alarm: 'Normal'
    },
    {
        station_id: 'BBRRI_HQ_GAZIPUR',
        station_name: 'BBRRI HQ Gazipur',
        state: 'Active',
        type: 'Weather Station',
        network: 'BRRI Network',
        owner: 'BRRI',
        power_save: 'Enabled',
        latest_data: '2025-01-10 10:30:00',
        measure: 'Temperature',
        last_value: 24.9,
        trend: 'Rising',
        delta_h: 0.4,
        unit: '°C',
        date_value: '2025-01-10 10:30:00',
        alarm: 'Normal'
    },
    {
        station_id: 'BBRRI_HQ_GAZIPUR',
        station_name: 'BBRRI HQ Gazipur',
        state: 'Active',
        type: 'Weather Station',
        network: 'BRRI Network',
        owner: 'BRRI',
        power_save: 'Enabled',
        latest_data: '2025-01-09 10:30:00',
        measure: 'Temperature',
        last_value: 23.7,
        trend: 'Rising',
        delta_h: 0.8,
        unit: '°C',
        date_value: '2025-01-09 10:30:00',
        alarm: 'Normal'
    },

    // BBRRI HQ Gazipur - Humidity data
    {
        station_id: 'BBRRI_HQ_GAZIPUR',
        station_name: 'BBRRI HQ Gazipur',
        state: 'Active',
        type: 'Weather Station',
        network: 'BRRI Network',
        owner: 'BRRI',
        power_save: 'Enabled',
        latest_data: '2025-01-15 10:30:00',
        measure: 'Humidity',
        last_value: 65.2,
        trend: 'Stable',
        delta_h: 0.1,
        unit: '%',
        date_value: '2025-01-15 10:30:00',
        alarm: 'Normal'
    },
    {
        station_id: 'BBRRI_HQ_GAZIPUR',
        station_name: 'BBRRI HQ Gazipur',
        state: 'Active',
        type: 'Weather Station',
        network: 'BRRI Network',
        owner: 'BRRI',
        power_save: 'Enabled',
        latest_data: '2025-01-14 10:30:00',
        measure: 'Humidity',
        last_value: 68.5,
        trend: 'Falling',
        delta_h: -2.3,
        unit: '%',
        date_value: '2025-01-14 10:30:00',
        alarm: 'Normal'
    },
    {
        station_id: 'BBRRI_HQ_GAZIPUR',
        station_name: 'BBRRI HQ Gazipur',
        state: 'Active',
        type: 'Weather Station',
        network: 'BRRI Network',
        owner: 'BRRI',
        power_save: 'Enabled',
        latest_data: '2025-01-13 10:30:00',
        measure: 'Humidity',
        last_value: 72.1,
        trend: 'Rising',
        delta_h: 1.8,
        unit: '%',
        date_value: '2025-01-13 10:30:00',
        alarm: 'Normal'
    },

    // BRRI Kushtia - Temperature data
    {
        station_id: 'BRRI_KUSHTIA',
        station_name: 'BRRI Kushtia',
        state: 'Active',
        type: 'Weather Station',
        network: 'BRRI Network',
        owner: 'BRRI',
        power_save: 'Enabled',
        latest_data: '2025-01-15 10:30:00',
        measure: 'Temperature',
        last_value: 28.2,
        trend: 'Rising',
        delta_h: 0.8,
        unit: '°C',
        date_value: '2025-01-15 10:30:00',
        alarm: 'Normal'
    },
    {
        station_id: 'BRRI_KUSHTIA',
        station_name: 'BRRI Kushtia',
        state: 'Active',
        type: 'Weather Station',
        network: 'BRRI Network',
        owner: 'BRRI',
        power_save: 'Enabled',
        latest_data: '2025-01-14 10:30:00',
        measure: 'Temperature',
        last_value: 27.5,
        trend: 'Rising',
        delta_h: 0.7,
        unit: '°C',
        date_value: '2025-01-14 10:30:00',
        alarm: 'Normal'
    },
    {
        station_id: 'BRRI_KUSHTIA',
        station_name: 'BRRI Kushtia',
        state: 'Active',
        type: 'Weather Station',
        network: 'BRRI Network',
        owner: 'BRRI',
        power_save: 'Enabled',
        latest_data: '2025-01-13 10:30:00',
        measure: 'Temperature',
        last_value: 26.8,
        trend: 'Falling',
        delta_h: -0.9,
        unit: '°C',
        date_value: '2025-01-13 10:30:00',
        alarm: 'Normal'
    },

    // BRRI Kushtia - Humidity data
    {
        station_id: 'BRRI_KUSHTIA',
        station_name: 'BRRI Kushtia',
        state: 'Active',
        type: 'Weather Station',
        network: 'BRRI Network',
        owner: 'BRRI',
        power_save: 'Enabled',
        latest_data: '2025-01-15 10:30:00',
        measure: 'Humidity',
        last_value: 58.7,
        trend: 'Falling',
        delta_h: -2.1,
        unit: '%',
        date_value: '2025-01-15 10:30:00',
        alarm: 'Normal'
    },
    {
        station_id: 'BRRI_KUSHTIA',
        station_name: 'BRRI Kushtia',
        state: 'Active',
        type: 'Weather Station',
        network: 'BRRI Network',
        owner: 'BRRI',
        power_save: 'Enabled',
        latest_data: '2025-01-14 10:30:00',
        measure: 'Humidity',
        last_value: 61.2,
        trend: 'Rising',
        delta_h: 1.5,
        unit: '%',
        date_value: '2025-01-14 10:30:00',
        alarm: 'Normal'
    }
];

const insertTestData = async () => {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        // Sync the model (this will create the table if it doesn't exist)
        await ResearchMeasures.sync({ force: true }); // This will drop and recreate the table
        console.log('ResearchMeasures table synced.');

        // Insert test data
        await ResearchMeasures.bulkCreate(testData);
        
        console.log(`Successfully inserted ${testData.length} test records.`);
        
        // Display summary
        const stationCount = await ResearchMeasures.count({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('station_id')), 'station_id']],
            group: ['station_id']
        });
        
        const parameterCount = await ResearchMeasures.count({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('measure')), 'measure']],
            group: ['measure']
        });
        
        console.log(`\nSummary:`);
        console.log(`- Total records: ${testData.length}`);
        console.log(`- Unique stations: ${stationCount.length}`);
        console.log(`- Unique parameters: ${parameterCount.length}`);
        
        console.log('\nTest data includes:');
        console.log('- BBRRI HQ Gazipur: Temperature (7 days), Humidity (3 days)');
        console.log('- BRRI Kushtia: Temperature (3 days), Humidity (2 days)');
        
    } catch (error) {
        console.error('Error inserting test data:', error);
    } finally {
        await sequelize.close();
        console.log('Database connection closed.');
    }
};

// Run the script
insertTestData(); 