const temperatureData = [
  { date: "2024-12-29", min: 13.968, max: 26.5917 },
  { date: "2024-12-30", min: 11.6554, max: 26.8987 },
  { date: "2024-12-31", min: 10.3446, max: 26.0563 },
  { date: "2025-01-01", min: 9.71222, max: 25.7137 },
  { date: "2025-01-02", min: 9.45499, max: 25.629 },
  { date: "2025-01-03", min: 8.71124, max: 25.9198 },
  { date: "2025-01-03", min: 8.71124, max: 25.9198 },
  { date: "2025-01-03", min: 8.71124, max: 25.9198 },
  { date: "2025-01-03", min: 8.71124, max: 25.9198 },

];

const TemperatureTable = () => {
  return (
   <div>
    
     <div className="max-w-full  w-full">
      
      <div className="overflow-x-auto border border-gray-300 rounded-lg max-h-[365px] custom-scrollbar">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border-b">Date</th>
              <th className="px-4 py-2 border-b">Min</th>
              <th className="px-4 py-2 border-b">Max</th>
            </tr>
          </thead>
          <tbody>
            {temperatureData.map((data, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-2 border-b">{data.date}</td>
                <td className="px-4 py-2 border-b">{data.min.toFixed(3)}</td>
                <td className="px-4 py-2 border-b">{data.max.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
   </div>
  );
};

export default TemperatureTable;
