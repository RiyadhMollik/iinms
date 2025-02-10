import AdminDashboard from "../../Components/AdminDashboard/AdminDashboard";
import { useAuthContext } from "../../Components/context/AuthProvider";
import Farmer from "../../Components/Farmer/Farmer";
import SoilDashboard from "../../Components/SoilDashboard/SoilDashboard";
import SuperAdminDashboard from "../../Components/SuperAdminDashboard/SuperAdminDashboard";
const SsDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-red-600 mb-6">SAAO</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="col-span-2 bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">Interactive Map of Bangladesh</h2>
          <p className="text-gray-600 mb-4">
            Explore the regions of Bangladesh for better insights into irrigation and nutrient
            management systems.
          </p>
          <div className="w-full h-[400px] rounded-lg overflow-hidden">
            <iframe
              title="Interactive Map of Bangladesh"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d582969.3857615712!2d90.18333300210676!3d23.7103944912321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7b25cf299f1%3A0x1d6c0ec6e63a2fdf!2sBangladesh!5e0!3m2!1sen!2sbd!4v1673540352803!5m2!1sen!2sbd"
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Device Status Section */}
        <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold mb-4">Device Status under ... Block</h2>
            <ul className="text-gray-700">
              <li className="mb-2">
                <span className="font-semibold">Devices Communicating:</span> 25
              </li>
              <li className="mb-2">
                <span className="font-semibold">Devices Offline:</span> 10
              </li>
              <li className="mb-2">
                <span className="font-semibold">Total Devices:</span> 35
              </li>
              <li className="mb-2">
                <span className="font-semibold">Total Farmers:</span> 200
              </li>
              <li>
                <span className="font-semibold">Last Updated:</span> Jan 11, 2025
              </li>
            </ul>
          </div>

          {/* Graph Section Placeholder */}
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-4">Graph</h2>
            <div className="w-full h-[200px] bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Graph Placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const Dashboard = () => {
  const { authUser, loadingUser } = useAuthContext();

  if (loadingUser) {
    return <p>Loading user data...</p>;
  }
  console.log(authUser);

  return (
    <div >
      {/* Main Content */}
      <h2 className="text-[16px] md:text-[22px] lg:text-[22px]  font-semibold mb-4 leading-[1.4] text-[#1f4e3b] text-center">
        Welcome to the Intelligent Irrigation and Nutrient Management System Dashboard
      </h2>
      <p className="text-[16px] leading-[1.6] text-[#555] text-center">
        This is where you can manage all your irrigation and nutrient requirements.
      </p>
      <Farmer />
      <div className="md:p-4 lg:p-4">
        <div className="flex flex-col lg:flex-row gap-5 mt-10 w-full">
          <div className="flex-2 w-full lg:w-[1000px] bg-white px-5 py-4 rounded-lg shadow-md">
            <h3 className="text-[20px] font-semibold text-[#1f4e3b] mb-4">
              Interactive Map of Bangladesh
            </h3>
            <p className="text-[16px] text-[#555] mb-5">
              Explore the regions of Bangladesh for better insights into irrigation and nutrient management systems.
            </p>
            <div className="rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d467700.51898092206!2d89.14517763706602!3d23.685009544508983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c712ba00b7c7%3A0xa12b03c215aa1c25!2sBangladesh!5e0!3m2!1sen!2sbd!4v1702220794017!5m2!1sen!2sbd"
                width="100%"
                height="450"
                className="border-none"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
          <div className="w-full lg:w-auto">
            <SoilDashboard />
          </div>
        </div>
      </div>
      <AdminDashboard />
      <SuperAdminDashboard />
      <SsDashboard />
    </div>
  );
};

export default Dashboard;






