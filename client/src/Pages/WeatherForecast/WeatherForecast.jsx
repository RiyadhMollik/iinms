import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Barchart from "../../Components/Barchart/Barchart";



const RainfallChart = () => {
  const rainfallData = [
    { date: "12/28/2024", Temperature: Math.floor(Math.random() * (22 - 14 + 1)) + 14 },
    { date: "12/27/2024", Temperature: Math.floor(Math.random() * (22 - 14 + 1)) + 14 },
    { date: "12/26/2024", Temperature: Math.floor(Math.random() * (22 - 14 + 1)) + 14 },
    { date: "12/25/2024", Temperature: Math.floor(Math.random() * (22 - 14 + 1)) + 14 },
    { date: "12/24/2024", Temperature: Math.floor(Math.random() * (22 - 14 + 1)) + 14 },
    { date: "12/23/2024", Temperature: Math.floor(Math.random() * (22 - 14 + 1)) + 14 },
    { date: "12/22/2024", Temperature: Math.floor(Math.random() * (22 - 14 + 1)) + 14 },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={rainfallData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="Temperature"
            stroke="#f10c0c"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
const SoilChart = () => {
  const rainfallData = [
    { date: "12/28/2024", SoilMoisture: Math.floor(Math.random() * (1 - 0.1 + 1)) + 0.1 },
    { date: "12/27/2024", SoilMoisture: Math.floor(Math.random() * (1 - 0.1 + 1)) + 0.1 },
    { date: "12/26/2024", SoilMoisture: Math.floor(Math.random() * (1 - 0.1 + 1)) + 0.1 },
    { date: "12/25/2024", SoilMoisture: Math.floor(Math.random() * (1 - 0.1 + 1)) + 0.1 },
    { date: "12/24/2024", SoilMoisture: Math.floor(Math.random() * (1 - 0.1 + 1)) + 0.1 },
    { date: "12/23/2024", SoilMoisture: Math.floor(Math.random() * (1 - 0.1 + 1)) + 0.1 },
    { date: "12/22/2024", SoilMoisture: Math.floor(Math.random() * (1 - 0.1 + 1)) + 0.1 },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={rainfallData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="SoilMoisture"
            stroke="#b5ae9b"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
const HumidityChart = () => {
  const rainfallData = [
    { date: "12/28/2024", SoilMoisture: Math.floor(Math.random() * (80 - 43 + 1)) + 43 },
    { date: "12/27/2024", SoilMoisture: Math.floor(Math.random() * (80 - 43 + 1)) + 43 },
    { date: "12/26/2024", SoilMoisture: Math.floor(Math.random() * (80 - 43 + 1)) + 43 },
    { date: "12/25/2024", SoilMoisture: Math.floor(Math.random() * (80 - 43 + 1)) + 43 },
    { date: "12/24/2024", SoilMoisture: Math.floor(Math.random() * (80 - 43 + 1)) + 43 },
    { date: "12/23/2024", SoilMoisture: Math.floor(Math.random() * (80 - 43 + 1)) + 43 },
    { date: "12/22/2024", SoilMoisture: Math.floor(Math.random() * (80 - 43 + 1)) + 43 },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={rainfallData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="SoilMoisture"
            stroke="#0cebfb"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

function WeatherForecast() {
  const [filters, setFilters] = useState({
    Hotspot: "",
    CSA: "",
    Region: "",
    Division: "",
    District: "",
    Upazilla: "",
    Union: "",
    Block: "",
  });

  const [options, setOptions] = useState({
    Hotspot: [],
    CSA: [],
    Region: [],
    Division: [],
    District: [],
    Upazilla: [],
    Union: [],
    Block: [],
  });

  useEffect(() => {
    fetch(`http://localhost:5000/api/data/filters?filterBy=Hotspot&value=''`)
      .then((res) => res.json())
      .then((data) => setOptions((prev) => ({ ...prev, Hotspot: data })));
  }, []);
console.log(options);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));

    const nextFilter = getNextFilter(name);
    if (nextFilter) {
      fetch(`http://localhost:5000/api/data/filters?filterBy=${name}&value=${value}`)
        .then((res) => res.json())
        .then((data) =>
          setOptions((prev) => ({ ...prev, [nextFilter]: data }))
        );
    }
  };

  const getNextFilter = (currentFilter) => {
    const filterKeys = Object.keys(filters);
    const currentIndex = filterKeys.indexOf(currentFilter);
    return currentIndex < filterKeys.length - 1 ? filterKeys[currentIndex + 1] : null;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 min-w-full">
      {/* Location Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-8">
        {Object.keys(filters).map((filterKey) => (
          <div key={filterKey}>
            <label className="block text-sm font-medium text-gray-700">
              {filterKey}
            </label>
            <select
              name={filterKey}
              value={filters[filterKey]}
              onChange={handleChange}
              className="w-full border rounded-lg px-2 py-1 mt-1 focus:ring-blue-500 focus:border-blue-500"
              disabled={
                filterKey !== "Hotspot" &&
                !filters[Object.keys(filters)[Object.keys(filters).indexOf(filterKey) - 1]]
              }
            >
              <option value="">Select {filterKey}</option>
              {Array.isArray(options[filterKey]) &&
                options[filterKey].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
            </select>

          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="space-y-8">
        <div className="bg-white shadow rounded-lg p-4">
          <Barchart />
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4">Temperature (°C)</h2>
          <div className="p-14">
            <RainfallChart />
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4">Relative Humidity (%)</h2>
          <div className="p-14">
            <HumidityChart />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4">Soil Moisture (%)</h2>
          <div className="p-14">
            <SoilChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherForecast;
