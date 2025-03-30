import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { MdGpsFixed } from "react-icons/md";
import axios from "axios";

const AdminRegistration = () => {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [AdminList, setAdminList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [regions, setRegions] = useState([]);
  const [hotspot, setHotspot] = useState([]);
  const [selectedHotspots, setSelectedHotspots] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [divisions, setDivisions] = useState([]);

  useEffect(() => {
    fetchDivisions();
  }, []);

  const fetchDivisions = async () => {
    try {
      const response = await axios.get('https://iinms.brri.gov.bd/api/division/divisions'); // Adjust API endpoint as needed
      setDivisions(response.data.reverse());
    } catch (error) {
      console.error("Error fetching divisions:", error);
    }
  };
  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      const response = await axios.get('https://iinms.brri.gov.bd/api/district/districts'); // Adjust API endpoint as needed
      setDistricts(response.data.reverse());
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };
  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    try {
      const response = await axios.get("https://iinms.brri.gov.bd/api/region/regions");
      console.log(response);

      setRegions(response.data.reverse());
    } catch (error) {
      console.error("Error fetching regions:", error);
    }
  };
  // Base API URL
  const API_URL = "https://iinms.brri.gov.bd/api/hotspots";

  // Fetch all hotspots
  const fetchRoles = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setHotspot(data.reverse());
    } catch (error) {
      console.error("Error fetching hotspots:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    gender: "",
    mobileNumber: "",
    whatsappNumber: "",
    imoNumber: "",
    messengerId: "",
    email: "",
    alternateContact: "",
    nationalId: "",
    // Location Information
    district: "",
    division: "",
    region: "",
    coordinates: "",
    hotspot:selectedHotspots,
    // Rice Crop Details
    // farmSize: "",
    // landType: "",
    // cultivationSeason: "",
    // majorCrops: "",
    // croppingPattern: "",
    // riceVarieties: "",
    // plantingMethod: "",
    // irrigationPractices: "",
    // fertilizerUsage: "",
    // soilType: "",
    // avgProduction: "",
    role: "Admin",
  });
  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setFormData({ ...formData, coordinates: `${lat}, ${lon}` });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Failed to fetch location. Please enable GPS.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };
  const fetchAdmins = async () => {
    try {
      const response = await fetch("https://iinms.brri.gov.bd/api/farmers/farmers/role/Admin");
      if (response.ok) {
        const data = await response.json();
        setAdminList(data);
      } else {
        throw new Error("Failed to fetch Admins");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);
  // Define the available columns and their initial visibility state
  const initialColumns = [
    { name: "ID", visible: true },
    { name: "Admin Name", visible: true },
    { name: "Father Name", visible: true },
    { name: "Gender", visible: true },
    { name: "Mobile Number", visible: true },
    { name: "Whatsapp Number", visible: true },
    { name: "Imo Number", visible: true },
    { name: "Messenger ID", visible: true },
    { name: "Email", visible: true },
    { name: "Alternate Contact", visible: true },
    { name: "National ID", visible: true },
    // Location Information
    { name: "District", visible: true },
    { name: "Division", visible: true },
    { name: "Region", visible: true },
    { name: "Coordinates", visible: true },
    { name: "Hotspot", visible: true },
    // // Rice Crop Details
    // { name: "Farm Size", visible: true },
    // { name: "Land Type", visible: true },
    // { name: "Cultivation Season", visible: true },
    // { name: "Major Crops", visible: true },
    // { name: "Cropping Pattern", visible: true },
    // { name: "Rice Varieties", visible: true },
    // { name: "Planting Method", visible: true },
    // { name: "Irrigation Practices", visible: true },
    // { name: "Fertilizer Usage", visible: true },
    // { name: "Soil Type", visible: true },
    // { name: "Avg Production", visible: true },
  ];


  const [columns, setColumns] = useState(initialColumns);

  const toggleColumnModal = () => setIsColumnModalOpen(!isColumnModalOpen);

  // Handle column visibility toggle
  const handleColumnToggle = (columnName) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.name === columnName ? { ...col, visible: !col.visible } : col
      )
    );
  };
  const toggleAdminModal = () => {
    setIsAdminModalOpen(!isAdminModalOpen);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep((prev) => prev + 1);
    else console.log("Form Data: ", formData);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };
  const resetForm = () => setCurrentStep(1);
  const closeModal = () => {
    setIsAdminModalOpen(false);
  };
  const registerAdmin = async () => {
    try {
      const response = await fetch("https://iinms.brri.gov.bd/api/farmers/farmers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        setIsAdminModalOpen(false);
        console.log("Admin registered successfully:", data);
        fetchAdmins();
      } else {
        throw new Error("Failed to register Admin");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // Filter AdminList based on search text
  const filteredAdmins = AdminList.filter((Admin) => {
    return (
      Admin.name.toLowerCase().includes(searchText.toLowerCase()) ||
      Admin.mobileNumber.includes(searchText) ||
      Admin.email.toLowerCase().includes(searchText.toLowerCase())
    );
  });
  const handleSelect = (e) => {
    const selectedValue = e.target.value;
    // Check if the value is already selected
    if (!selectedHotspots.includes(selectedValue)) {
      setSelectedHotspots([...selectedHotspots, selectedValue]);
    }
  };

  const handleDelete = (valueToDelete) => {
    // Remove selected value
    const updatedHotspot = selectedHotspots.filter((value) => value !== valueToDelete);
    setSelectedHotspots(updatedHotspot);
  };
  return (
    <div className="min-h-screen w-full bg-gray-100">

      {/* Main Content */}
      <main className=" md:p-6 lg:p-8">
        <div className="container mx-auto bg-white rounded-lg shadow-md p-6 ">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Admin List</h1>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={toggleAdminModal}
            >
              + Add Admin
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-4 w-full space-y-3 md:space-y-0">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by Name, Phone, or Email"
              className="border rounded px-4 py-2 w-full md:w-1/2 lg:w-1/3"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            {/* Buttons & Select Section */}
            <div className="flex flex-wrap justify-center md:justify-end space-x-2">
              <select
                className="border rounded px-4 py-2"
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
              >
                <option value={10}>Show 10</option>
                <option value={25}>Show 25</option>
                <option value={50}>Show 50</option>
              </select>
              <button className="border px-4 py-2 rounded hover:bg-gray-100">Copy</button>
              <button className="border px-4 py-2 rounded hover:bg-gray-100">Excel</button>
              <button className="border px-4 py-2 rounded hover:bg-gray-100">CSV</button>
              <button className="border px-4 py-2 rounded hover:bg-gray-100">PDF</button>
              <button
                className="border px-4 py-2 rounded hover:bg-gray-100 flex items-center justify-center"
                onClick={toggleColumnModal}
              >
                <FaBars className="text-lg" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="max-w-[150vh]  overflow-x-scroll">
            <table className="table-auto w-full mt-4 border rounded ">
              <thead>
                <tr className="bg-gray-200">
                  {columns
                    .filter((col) => col.visible)
                    .map((col) => (
                      <th key={col.name} className="border px-4 py-2">
                        {col.name}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.slice(0, rowsPerPage).map(Admin => (
                  <tr key={Admin.id}>
                    {columns
                      .filter((col) => col.visible)
                      .map((col) => (
                        <td key={col.name} className="border px-4 py-2">
                          {/* Render Admin data dynamically based on column names */}
                          {col.name === "ID" && Admin.id}
                          {col.name === "Admin Name" && Admin.name}
                          {col.name === "Father Name" && Admin.fatherName}
                          {col.name === "Gender" && Admin.gender}
                          {col.name === "Mobile Number" && Admin.mobileNumber}
                          {col.name === "Whatsapp Number" && Admin.whatsappNumber}
                          {col.name === "Imo Number" && Admin.imoNumber}
                          {col.name === "Messenger ID" && Admin.messengerId}
                          {col.name === "Email" && Admin.email}
                          {col.name === "Alternate Contact" && Admin.alternateContact}
                          {col.name === "National ID" && Admin.nationalId}
                          {col.name === "Agriculture Card" && Admin.agrilCard}
                          {col.name === "Education Status" && Admin.educationStatus}
                          {col.name === "District" && Admin.district}
                          {col.name === "Division" && Admin.division}
                          {col.name === "Region" && Admin.region}
                          {col.name === "Coordinates" && Admin.coordinates}
                          {col.name === "Hotspot" && Admin.hotspot}
                          {col.name === "Action" && (
                            <i className="fas fa-ellipsis-h text-gray-500"></i>
                          )}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Column Modal */}
        {isColumnModalOpen && (
          <div className="fixed inset-0  z-[999] bg-black bg-opacity-50 flex items-center justify-end">
            <div className="bg-white p-6 rounded shadow-lg w-full md:w-1/3 lg:w-1/3">
              <h3 className="text-lg font-semibold mb-4">Select Columns</h3>
              <ul className="space-y-2 max-h-[50vh] overflow-y-scroll">
                {columns.map((col) => (
                  <li key={col.name} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={col.visible}
                      onChange={() => handleColumnToggle(col.name)}
                    />
                    <span>{col.name}</span>
                  </li>
                ))}
              </ul>
              <button
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={toggleColumnModal}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Admin Modal */}
        {isAdminModalOpen && (
          <div className=" fixed inset-0 z-[999999] bg-black bg-opacity-50 flex items-center justify-center">
            <div className="relative max-h-[90vh] overflow-y-scroll  bg-white p-6 rounded-lg shadow-lg w-full  md:w-2/3 lg:w-2/3">
              <h3 className="text-lg font-semibold mb-4">Admin Registration</h3>
              <button
                className="absolute top-2 right-5 text-xl text-gray-500 hover:text-gray-800"
                onClick={closeModal}
              >
                &times;
              </button>
              <form>
                {/* Step 1: Admin Identification */}
                <div className={`space-y-4 ${currentStep === 1 ? "" : "hidden"}`}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Admin's Name"
                    className="border w-full p-2 rounded"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="fatherName"
                    placeholder="Father's Name"
                    className="border w-full p-2 rounded"
                    value={formData.fatherName}
                    onChange={handleChange}
                  />
                  <select
                    name="gender"
                    className="border w-full p-2 rounded"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <input
                    type="text"
                    name="mobileNumber"
                    placeholder="Mobile Number"
                    className="border w-full p-2 rounded"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="whatsappNumber"
                    placeholder="WhatsApp Number"
                    className="border w-full p-2 rounded"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="imoNumber"
                    placeholder="IMO Number"
                    className="border w-full p-2 rounded"
                    value={formData.imoNumber}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="messengerId"
                    placeholder="Messenger ID"
                    className="border w-full p-2 rounded"
                    value={formData.messengerId}
                    onChange={handleChange}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="border w-full p-2 rounded"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="alternateContact"
                    placeholder="Alternate Contact"
                    className="border w-full p-2 rounded"
                    value={formData.alternateContact}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="nationalId"
                    placeholder="National ID"
                    className="border w-full p-2 rounded"
                    value={formData.nationalId}
                    onChange={handleChange}
                  />
                </div>
                {/* Step 2: Location Information */}
                <div className={`space-y-4 ${currentStep === 2 ? "" : "hidden"}`}>
                  <select
                    name="district"
                    className="border w-full p-2 rounded"
                    value={formData.district}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select District</option>
                    {districts?.map((district) => (
                      <option key={district.id} value={district.name}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="coordinates"
                      placeholder="Coordinates (e.g., Latitude, Longitude)"
                      className="border w-full p-2 rounded"
                      value={formData.coordinates}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="text-blue-500 text-white  rounded"
                      onClick={handleUseMyLocation}
                    >
                      <MdGpsFixed className="text-blue-500" />
                    </button>
                  </div>
                  <select
                    name="division"
                    className="border w-full p-2 rounded"
                    value={formData.division}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Division</option>
                    {divisions?.map((division) => (
                      <option key={division.id} value={division.name}>
                        {division.name}
                      </option>
                    ))}
                  </select>
                  <select
                    name="region"
                    className="border w-full p-2 rounded"
                    value={formData.region}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Region</option>
                    {regions?.map((hotspot) => (
                      <option key={hotspot.id} value={hotspot.name}>
                        {hotspot.name}
                      </option>
                    ))}
                  </select>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedHotspots.map((hotspotName) => (
                      <div key={hotspotName} className="flex items-center bg-gray-200 p-1 rounded">
                        <span>{hotspotName}</span>
                        <button
                          type="button"
                          className="ml-2 text-red-500"
                          onClick={() => handleDelete(hotspotName)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <select
                    name="hotspot"
                    className="border w-full p-2 rounded"
                    value="" // No value here as it's not multiple
                    onChange={handleSelect}
                    required
                  >
                    <option value="">Select Hotspot</option>
                    {hotspot?.map((hotspot) => (
                      <option key={hotspot.id} value={hotspot.name}>
                        {hotspot.name}
                      </option>
                    ))}
                  </select>

                </div>
              </form>

              {/* Navigation Buttons */}
              <div className="flex justify-between space-x-4 mt-4">
                <button
                  className={`bg-gray-400 text-white px-4 py-2 rounded ${currentStep === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-500"
                    }`}
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </button>
                {currentStep === 2 ?
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={registerAdmin}
                  >
                    Submit
                  </button> :
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={nextStep}
                  >
                    Next
                  </button>}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminRegistration
