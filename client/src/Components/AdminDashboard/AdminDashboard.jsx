
const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="text-red-600 text-xl font-bold mb-4">Admin/DD</header>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-6">
        <div className="border-2 border-green-600 p-2 text-center font-medium">District</div>
        <div className="border-2 border-green-600 p-2 text-center font-medium">Upazilla</div>
        <div className="border-2 border-green-600 p-2 text-center font-medium">Block</div>
        <div className="border-2 border-green-600 p-2 text-center font-medium">Block</div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Interactive Map */}
        <div className="md:col-span-2 border-2 border-green-600 p-4">
          <h2 className="text-lg font-semibold mb-2">Interactive Map of Bangladesh</h2>
          <p className="text-gray-600 mb-4">
            Explore the regions of Bangladesh for better insights into irrigation and nutrient management systems.
          </p>
          {/* Embedded Google Map */}
          <iframe
            className="w-full h-72 sm:h-80 md:h-96 border-2"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d58312.18697807091!2d90.4125186!3d23.810332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1689888420738!5m2!1sen!2sbd"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        {/* Device Status */}
        <div className="border-2 border-green-600 p-4">
          <h2 className="text-lg font-semibold mb-4">Device Status under ...Block</h2>
          <p className="mb-2">Devices Communicating:</p>
          <p className="mb-2">Devices Offline:</p>
          <p className="mb-2">Total Devices:</p>
          <p className="mb-2">Total Farmers:</p>
          <p className="mb-2">Last Updated:</p>
        </div>

        {/* Graph Placeholder */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 border-2 border-green-600 p-4 mt-4">
          <h2 className="text-lg font-semibold mb-4">Graph</h2>
          {/* Replace this div with your actual graph/chart */}
          <div className="h-64 bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Graph Placeholder</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
