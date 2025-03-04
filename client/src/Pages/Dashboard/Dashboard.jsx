import AdminDashboard from "../../Components/AdminDashboard/AdminDashboard";
import { useAuthContext } from "../../Components/context/AuthProvider";
import Farmer from "../../Components/Farmer/Farmer";
import MapboxExample from "../../Components/Map/map";
import Map from "../../Components/Map/map";
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
            <MapboxExample />
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
      {
        authUser.role == 'farmer' && <>
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
                <div className="rounded-lg overflow-hidden max-h-[400px]">
                  <MapboxExample />
                </div>
              </div>
              <div className="w-full lg:w-auto">
                <SoilDashboard />
              </div>
            </div>
          </div>
        </>
      }
      {
        authUser.role == 'super admin' && <>
          <SuperAdminDashboard />
        </>
      }
      {
        authUser.role == 'admin' && <>
          <AdminDashboard />
        </>
      }
      {(authUser.role === 'saao' || authUser.role === 'uao') && <SsDashboard />}

      
    </div>
  );
};

export default Dashboard;






