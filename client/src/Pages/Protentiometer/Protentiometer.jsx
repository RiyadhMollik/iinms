
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
import TemperatureTable from "../../Components/TemperatureTable/TemperatureTable";

const RainfallChart = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  useEffect(() => {
    const fetchTemperatureData = async () => {
      try {
        const response = await fetch("https://iinms.brri.gov.bd/api/stats/temperature");
        const data = await response.json();
        setSelectedDate(data);
        if (Array.isArray(data)) {
          const formattedData = data.map(({ date, avg_temperature }) => ({
            date: new Date(date).toLocaleDateString("en-US"),
            Temperature: parseFloat(avg_temperature.toFixed(3)),
          }));

          setTemperatureData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching temperature data:", error);
      }
    };

    fetchTemperatureData();
  }, []);

  return (
    <div className="h-96 flex">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={temperatureData}
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
      <TemperatureTable data={selectedDate} />
    </div>
  );
};
const SoilMoisture = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  useEffect(() => {
    const fetchTemperatureData = async () => {
      try {
        const response = await fetch("https://iinms.brri.gov.bd/api/stats/soil-moisture");
        const data = await response.json();
        setSelectedDate(data);
        if (Array.isArray(data)) {
          const formattedData = data.map(({ date, avg_soil_moisture }) => ({
            date: new Date(date).toLocaleDateString("en-US"),
            SoilMoisture: parseFloat(avg_soil_moisture.toFixed(3)),
          }));

          setTemperatureData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching temperature data:", error);
      }
    };

    fetchTemperatureData();
  }, []);

  return (
    <div className="h-96 flex">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={temperatureData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="SoilMoisture"
            stroke="#bcad98"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
      <TemperatureTable data={selectedDate} />
    </div>
  );
};
const WaterLevel = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  useEffect(() => {
    const fetchTemperatureData = async () => {
      try {
        const response = await fetch("https://iinms.brri.gov.bd/api/stats/water-level");
        const data = await response.json();
        setSelectedDate(data);
        if (Array.isArray(data)) {
          const formattedData = data.map(({ date, avg_water_level }) => ({
            date: new Date(date).toLocaleDateString("en-US"),
            WaterLevel: parseFloat(avg_water_level.toFixed(3)),
          }));

          setTemperatureData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching temperature data:", error);
      }
    };

    fetchTemperatureData();
  }, []);

  return (
    <div className="h-96 flex">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={temperatureData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="WaterLevel"
            stroke="#008FFB"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
      <TemperatureTable data={selectedDate} />
    </div>
  );
};

function Protentiometer() {
  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="space-y-8">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4">Soil Moisture (%)</h2>
          <div className="p-14">
            <SoilMoisture />
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4">Water Level (cm)</h2>
          <div className="p-14">
            <WaterLevel />
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4">Soil Temperature (oC)</h2>
          <div className="p-14">
            <RainfallChart />
          </div>
        </div>
      </div>


    </div>
  )
}

export default Protentiometer