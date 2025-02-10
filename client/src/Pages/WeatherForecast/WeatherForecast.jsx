
function WeatherForecast() {
    return (
        <div className="min-h-screen bg-gray-100 p-4 min-w-full">
            {/* Location Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Division</label>
                    <input
                        type="text"
                        className="w-full border rounded-lg px-2 py-1 mt-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">District</label>
                    <input
                        type="text"
                        className="w-full border rounded-lg px-2 py-1 mt-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Upazilla</label>
                    <input
                        type="text"
                        className="w-full border rounded-lg px-2 py-1 mt-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Block</label>
                    <input
                        type="text"
                        className="w-full border rounded-lg px-2 py-1 mt-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Charts Section */}
            <div className="space-y-8">
                {/* Rainfall */}
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-lg font-bold mb-4">Rainfall</h2>
                   <RainfallChart />
                </div>

                {/* Temperature */}
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-lg font-bold mb-4">Temperature</h2>
                    <RainfallChart />
                </div>

                {/* Soil Moisture */}
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-lg font-bold mb-4">Soil Moisture (%)</h2>
                    <RainfallChart />
                </div>
            </div>
        </div>
    );
}

export default WeatherForecast;


import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const RainfallChart = () => {
  const data = [
    { date: "2023-12-22", rainfall: 0 },
    { date: "2023-12-23", rainfall: 4 },
    { date: "2023-12-24", rainfall: 6 },
    { date: "2023-12-25", rainfall: 10 },
    { date: "2023-12-26", rainfall: 3 },
    { date: "2023-12-27", rainfall: 5 },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="rainfall" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};




