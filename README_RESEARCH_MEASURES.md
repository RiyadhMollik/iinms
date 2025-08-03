# Research Measures API Integration

This document explains how to use the new Research Measures functionality that has been integrated into the AAPLStockChart component.

## Overview

The system now includes a complete API for managing research measures data with the following features:

- **Real-time data fetching** from the database
- **Dynamic station and parameter selection**
- **Interactive charts** with Highcharts
- **Error handling and loading states**
- **Responsive design**

## Database Schema

The `research_measures` table has the following structure:

```sql
CREATE TABLE research_measures (
    id INT PRIMARY KEY AUTO_INCREMENT,
    station_id VARCHAR(255) NOT NULL,
    station_name VARCHAR(255) NOT NULL,
    state VARCHAR(255),
    type VARCHAR(255),
    network VARCHAR(255),
    owner VARCHAR(255),
    power_save VARCHAR(255),
    latest_data VARCHAR(255),
    measure VARCHAR(255) NOT NULL,
    last_value DECIMAL(10,2),
    trend VARCHAR(255),
    delta_h DECIMAL(10,2),
    unit VARCHAR(255),
    date_value DATETIME,
    alarm VARCHAR(255)
);
```

## API Endpoints

### Base URL: `/api/research-measures`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all measures |
| GET | `/stations` | Get unique stations |
| GET | `/parameters` | Get unique parameters |
| GET | `/station/:station_id` | Get measures by station |
| GET | `/parameter/:measure` | Get measures by parameter |
| GET | `/station/:station_id/parameter/:measure` | Get measures by station and parameter |
| POST | `/` | Add new measure |
| PUT | `/:id` | Update measure |
| DELETE | `/:id` | Delete measure |

## Setup Instructions

### 1. Database Setup

Make sure your MySQL database is running and the connection is configured in `config/db.js`.

### 2. Insert Sample Data

Run the sample data insertion script to populate the database with test data:

```bash
node scripts/insertSampleData.js
```

This will create:
- 3 weather stations (BBRRI HQ Gazipur, BRRI Kushtia, Rice Research Institute Rajshahi)
- 7 different parameters (Temperature, Humidity, Rainfall, Solar Radiation, Soil Moisture, Wind Speed, Sunshine)
- 30 days of historical data for each station-parameter combination

### 3. Start the Server

```bash
npm start
# or
node index.js
```

### 4. Access the Chart

Navigate to the AAPLStockChart page in your application. The component will now:

1. **Load stations and parameters** from the API on component mount
2. **Auto-select** the first available station and parameter
3. **Fetch and display** real data in the chart
4. **Handle errors** gracefully with retry options
5. **Show loading states** during data fetching

## Component Features

### Dynamic Data Loading
- Fetches stations and parameters from the API
- Automatically loads data when selections change
- Real-time chart updates

### Error Handling
- Network error detection
- User-friendly error messages
- Retry functionality

### Loading States
- Spinner during data fetching
- Disabled controls during loading
- Clear status indicators

### Responsive Design
- Mobile-friendly interface
- Adaptive chart sizing
- Touch-friendly controls

## Usage Examples

### Adding New Data

```javascript
// Add a new measurement
const newMeasure = {
    station_id: 'NEW_STATION',
    station_name: 'New Weather Station',
    measure: 'Temperature',
    last_value: 25.5,
    unit: '°C',
    date_value: new Date().toISOString()
};

fetch('/api/research-measures', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(newMeasure)
});
```

### Fetching Data for Chart

```javascript
// Get data for specific station and parameter
const response = await fetch('/api/research-measures/station/BBRRI_HQ_GAZIPUR/parameter/Temperature');
const data = await response.json();

// Transform for Highcharts
const chartData = data.map(item => [
    new Date(item.date_value).getTime(),
    parseFloat(item.last_value)
]);
```

## Troubleshooting

### Common Issues

1. **No data displayed**
   - Check if the database has data
   - Verify API endpoints are accessible
   - Check browser console for errors

2. **Database connection errors**
   - Verify MySQL is running
   - Check database credentials in `config/db.js`
   - Ensure database `brri-server` exists

3. **Chart not loading**
   - Check if Highcharts is properly imported
   - Verify data format matches expected structure
   - Check for JavaScript errors in console

### Debug Mode

Enable debug logging by adding to your environment:

```bash
DEBUG=app:*
```

## File Structure

```
├── models/
│   └── ResearchMeasures.js          # Sequelize model
├── controllers/
│   └── researchMeasuresController.js # API controllers
├── routes/
│   └── researchMeasuresRoutes.js    # API routes
├── scripts/
│   └── insertSampleData.js          # Sample data script
├── client/src/Pages/AAPLStockChart/
│   └── AAPLStockChart.jsx           # Updated component
└── index.js                         # Main server file
```

## Future Enhancements

- **Real-time updates** using WebSocket
- **Data export** functionality
- **Advanced filtering** options
- **Multiple parameter** comparison charts
- **Alert system** for threshold violations
- **Data validation** and quality checks

## Support

For issues or questions, check the console logs and ensure all dependencies are properly installed. 