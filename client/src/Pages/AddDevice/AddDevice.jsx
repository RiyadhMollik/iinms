import { useEffect, useState, useRef } from "react";
import { BiPen } from "react-icons/bi";

const AddDevice = () => {
  const [devices, setDevices] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add"); // 'add' or 'edit'
  const [currentUser, setCurrentUser] = useState({ id: null, name: "", deviceId: "", });
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [searchFarmer, setSearchFarmer] = useState("");
  const [showFarmerDropdown, setShowFarmerDropdown] = useState(false);

  const USERS_API_URL = "https://iinms.brri.gov.bd/api/devices";
  const FARMERS_API_URL = "https://iinms.brri.gov.bd/api/farmers/farmers";

  const farmerInputRef = useRef();

  // Fetch all users
  const fetchDevices = async () => {
    try {
      const response = await fetch(USERS_API_URL);
      const data = await response.json();
      setDevices(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch farmers
  const fetchFarmers = async () => {
    try {
      const response = await fetch(FARMERS_API_URL);
      const data = await response.json();
      setFarmers(data);
      setFilteredFarmers(data.slice(0, 5)); // Show first 5 farmers initially
    } catch (error) {
      console.error("Error fetching farmers:", error);
    }
  };

  useEffect(() => {
    fetchDevices();
    fetchFarmers();
  }, []);

  const openModal = (type, user = { id: null, name: "", deviceId: "" }) => {
    setModalType(type);
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser({ id: null, name: "", deviceId: "", });
    setSelectedFarmer(null);
  };

  const handleSave = async () => {
    const { id, name,deviceId } = currentUser;
    const payload = {
      name,
      deviceId,
      farmerId: selectedFarmer?.id || null,
    };

    try {
      if (modalType === "add") {
        await fetch(USERS_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else if (modalType === "edit") {
        await fetch(`${USERS_API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      fetchDevices(); 
      closeModal();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${USERS_API_URL}/${id}`, { method: "DELETE" });
      fetchDevices(); // Refresh users list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Filter farmers based on search input
  useEffect(() => {
    if (searchFarmer) {
      setFilteredFarmers(
        farmers.filter((farmer) =>
          farmer.name.toLowerCase().includes(searchFarmer.toLowerCase())
        )
      );
    } else {
      setFilteredFarmers(farmers.slice(0, 5)); // Show first 5 if no search input
    }
  }, [searchFarmer, farmers]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        farmerInputRef.current &&
        !farmerInputRef.current.contains(event.target)
      ) {
        setShowFarmerDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-[166vh] mx-auto p-4 bg-[#f9fafb]">
      <h1 className="text-2xl font-semibold mb-4">User List</h1>
      <button
        className="mb-4 px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600"
        onClick={() => openModal("add")}
      >
        Add User
      </button>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2 border border-gray-300">Name</th>
            <th className="text-left px-4 py-2 border border-gray-300">Device ID</th>
            <th className="text-left px-4 py-2 border border-gray-300">Action</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((user) => (
            <tr key={user.id} className="bg-gray-50">
              <td className="px-4 py-2 border border-gray-300">{user.name}</td>
              <td className="px-4 py-2 border border-gray-300">{user.deviceId}</td>
              <td className="px-4 py-2 border border-gray-300">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => openModal("edit", user)}
                >
                  <BiPen />
                </button>
                <button
                  className="text-red-500 hover:text-red-700 ml-2"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start mt-10 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[500px]">
            <h2 className="text-xl font-bold mb-4">
              {modalType === "add" ? "Add Device" : "Edit Device"}
            </h2>

            {/* Farmer Name Dropdown */}
            <div className="mb-4 relative" ref={farmerInputRef}>
              <label className="block text-sm font-medium mb-1">Farmer Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded mb-1"
                placeholder="Search farmer"
                value={searchFarmer}
                onFocus={() => setShowFarmerDropdown(true)}
                onChange={(e) => setSearchFarmer(e.target.value)}
              />
              {showFarmerDropdown && (
                <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded shadow-lg max-h-40 overflow-y-auto">
                  {filteredFarmers.map((farmer, index) => (
                    <li
                      key={index}
                      className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                        selectedFarmer?.name === farmer.name ? "bg-gray-200" : ""
                      }`}
                      onClick={() => {
                        setSelectedFarmer(farmer);
                        setCurrentUser({ ...currentUser, name: farmer.name });
                        setSearchFarmer(farmer.name);
                        setShowFarmerDropdown(false);
                      }}
                    >
                      {farmer.name}
                    </li>
                  ))}
                  {filteredFarmers.length === 0 && (
                    <li className="px-3 py-2 text-gray-500">No farmers found</li>
                  )}
                </ul>
              )}
            </div>
            {/* Password Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Device ID</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="Enter deviceId"
                value={currentUser.deviceId}
                onChange={(e) => setCurrentUser({ ...currentUser, deviceId: e.target.value })}
              />
            </div>

            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 rounded mr-2 hover:bg-gray-400"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDevice;
