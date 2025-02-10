

const SuperAdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="text-center mb-4">
        <h1 className="text-red-600 text-2xl font-bold">Super Admin</h1>
      </header>

      {/* Filters and Main Content */}
      <div className="grid grid-cols-12 gap-4">
        {/* Dropdown Filters */}
        <div className="col-span-12 md:col-span-3 space-y-4">
          <div>
            <label htmlFor="region" className="block font-semibold text-gray-700">
              Region
            </label>
            <select
              id="region"
              className="block w-full mt-1 border-gray-300 rounded shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            >
              <option value="">Select Region</option>
            </select>
          </div>
          <div>
            <label htmlFor="district" className="block font-semibold text-gray-700">
              District
            </label>
            <select
              id="district"
              className="block w-full mt-1 border-gray-300 rounded shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            >
              <option value="">Select District</option>
            </select>
          </div>
          <div>
            <label htmlFor="upazilla" className="block font-semibold text-gray-700">
              Upazilla
            </label>
            <select
              id="upazilla"
              className="block w-full mt-1 border-gray-300 rounded shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            >
              <option value="">Select Upazilla</option>
            </select>
          </div>
          <div>
            <label htmlFor="block" className="block font-semibold text-gray-700">
              Block
            </label>
            <select
              id="block"
              className="block w-full mt-1 border-gray-300 rounded shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            >
              <option value="">Select Block</option>
            </select>
          </div>
        </div>

        {/* Interactive Map and Status Section */}
        <div className="col-span-12 md:col-span-9 grid grid-cols-12 gap-4">
          {/* Map */}
          <div className="col-span-12 lg:col-span-8 bg-white shadow rounded p-4">
            <h2 className="text-lg font-bold mb-2">Interactive Map of Bangladesh</h2>
            <iframe
              title="Map of Bangladesh"
              className="w-full h-96 border rounded"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d233667.8223923983!2d90.2792378051553!3d23.780887455792925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7b8a1f6e715%3A0xe2f4c4da3160b7ef!2sBangladesh!5e0!3m2!1sen!2sbd!4v1694576895134!5m2!1sen!2sbd"
              loading="lazy"
            ></iframe>
          </div>

          {/* Device Status */}
          <div className="col-span-12 lg:col-span-4 bg-white shadow rounded p-4">
            <h2 className="text-lg font-bold mb-4">Device Status under ... Block</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="font-semibold">Devices Communicating:</span> 0
              </li>
              <li>
                <span className="font-semibold">Devices Offline:</span> 0
              </li>
              <li>
                <span className="font-semibold">Total Devices:</span> 0
              </li>
              <li>
                <span className="font-semibold">Total Farmers:</span> 0
              </li>
              <li>
                <span className="font-semibold">Last Updated:</span> N/A
              </li>
            </ul>
          </div>

          {/* Graph Section */}
          <div className="col-span-12 bg-white shadow rounded p-4">
            <h2 className="text-lg font-bold mb-2">Graph</h2>
            <div className="h-64 border rounded bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Graph Placeholder</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
