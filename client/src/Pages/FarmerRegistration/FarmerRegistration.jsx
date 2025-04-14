import { useEffect, useState } from "react";
import { FaBars, FaEdit, FaTrash } from "react-icons/fa";
import { MdGpsFixed } from "react-icons/md";
import axios from "axios";
const FarmerRegistration = () => {
  const [isFarmerModalOpen, setIsFarmerModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [farmerList, setFarmerList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [regions, setRegions] = useState([]);
  const [hotspot, setHotspot] = useState([]);
  const [selectedHotspots, setSelectedHotspots] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [unions, setUnions] = useState([]);
  const [block, setBlock] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
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
    upazila: "",
    district: "",
    division: "",
    region: "",
    coordinates: "",
    hotspot: selectedHotspots,
    role: "UAO",
  });
  useEffect(() => {
    if (!formData.upazila || !formData.district || !formData.division || !formData.region || !selectedHotspots) return; // Prevent unnecessary API calls

    const fetchUnion = async () => {
      try {
        const response = await fetch(`https://iinms.brri.gov.bd/api/data/unions?upazila=${formData.upazila}&district=${formData.district}&division=${formData.division}&region=${formData.region}&hotspot=${selectedHotspots}`);
        if (!response.ok) {
          throw new Error("Failed to fetch union data");
        }
        const data = await response.json();
        setUnions(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error("Error fetching union data:", error);
      }
    };

    fetchUnion();
  }, [formData.upazila, formData.district, formData.division, formData.region, selectedHotspots]);
  useEffect(() => {
    if (!formData.union || !formData.upazila || !formData.district || !formData.division || !formData.region || !selectedHotspots) return; // Prevent unnecessary API calls

    const fetchBlock = async () => {
      try {
        const response = await fetch(`https://iinms.brri.gov.bd/api/data/blocks?union=${formData.union}&upazila=${formData.upazila}&district=${formData.district}&division=${formData.division}&region=${formData.region}&hotspot=${selectedHotspots}`);
        if (!response.ok) {
          throw new Error("Failed to fetch block data");
        }
        const data = await response.json();
        setBlock(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error("Error fetching block data:", error);
      }
    };

    fetchBlock();
  }, [formData.union, formData.upazila, formData.district, formData.division, formData.region, selectedHotspots]);

  useEffect(() => {
    if (!formData.district || !formData.division || !formData.region || !selectedHotspots) return; // Prevent unnecessary API calls

    const fetchUpazila = async () => {
      try {
        const response = await fetch(
          `https://iinms.brri.gov.bd/api/data/upazilas?district=${formData.district}&division=${formData.division}&region=${formData.region}&hotspot=${selectedHotspots}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch upazila data");
        }
        const data = await response.json();
        setUpazilas(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error("Error fetching upazila data:", error);
      }
    };

    fetchUpazila();
  }, [formData.district, formData.division, formData.region, selectedHotspots]);

  useEffect(() => {
    if (!formData.region || !selectedHotspots) return; // Prevent unnecessary API calls 

    const fetchDivision = async () => {
      try {
        const response = await fetch(
          `https://iinms.brri.gov.bd/api/data/divisions?region=${formData.region}&hotspot=${selectedHotspots}`
        );
        console.log(response);

        if (!response.ok) {
          throw new Error("Failed to fetch division data");
        }
        const data = await response.json();
        console.log(data);

        setDivisions(
          data.sort((a, b) => a.localeCompare(b))
        );
      } catch (error) {
        console.error("Error fetching division data:", error);
      }
    };

    fetchDivision();
  }, [formData.region, selectedHotspots]);

  useEffect(() => {
    if (!formData.division || !formData.region || !selectedHotspots) return; // Prevent unnecessary API calls

    const fetchDistrict = async () => {
      try {
        const response = await fetch(
          `https://iinms.brri.gov.bd/api/data/districts?division=${formData.division}&region=${formData.region}&hotspot=${selectedHotspots}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch district data");
        }
        const data = await response.json();
        setDistricts(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error("Error fetching district data:", error);
      }
    };

    fetchDistrict();
  }, [formData.division, formData.region, selectedHotspots]);
  useEffect(() => {
    if (!selectedHotspots) return; // Prevent unnecessary API calls

    const fetchRegion = async () => {
      try {
        const response = await fetch(
          `https://iinms.brri.gov.bd/api/data/regions?hotspot=${selectedHotspots}`
        );
        console.log(response);

        if (!response.ok) {
          throw new Error("Failed to fetch region data");
        }
        const data = await response.json();
        console.log(data);

        setRegions(data.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error("Error fetching region data:", error);
      }
    };

    fetchRegion();
  }, [selectedHotspots]);
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
  const fetchFarmers = async () => {
    try {
      const response = await fetch("https://iinms.brri.gov.bd/api/farmers/farmers/role/farmer");
      console.log(response);

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        setFarmerList(data);
      } else {
        throw new Error("Failed to fetch farmers");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);
  // Define the available columns and their initial visibility state
  const initialColumns = [
    { name: "ID", visible: true },
    { name: "Farmer Name", visible: true },
    { name: "Father Name", visible: true },
    { name: "Gender", visible: true },
    { name: "Mobile Number", visible: true },
    { name: "Whatsapp Number", visible: true },
    { name: "Imo Number", visible: true },
    { name: "Messenger ID", visible: true },
    { name: "Email", visible: true },
    { name: "Alternate Contact", visible: true },
    { name: "National ID", visible: true },
    { name: "Agriculture Card", visible: true },
    { name: "Education Status", visible: true },
    // Location Information
    { name: "Village", visible: true },
    { name: "Block", visible: true },
    { name: "Union", visible: true },
    { name: "Upazila", visible: true },
    { name: "District", visible: true },
    { name: "Division", visible: true },
    { name: "Region", visible: true },
    { name: "Coordinates", visible: true },
    { name: "Hotspot", visible: true },
    // Rice Crop Details
    { name: "Farm Size", visible: true },
    { name: "Land Type", visible: true },
    { name: "Cultivation Season", visible: true },
    { name: "Major Crops", visible: true },
    { name: "Cropping Pattern", visible: true },
    { name: "Rice Varieties", visible: true },
    { name: "Planting Method", visible: true },
    { name: "Irrigation Practices", visible: true },
    { name: "Fertilizer Usage", visible: true },
    { name: "Soil Type", visible: true },
    { name: "Action", visible: true },
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
  const toggleFarmerModal = () => {
    setIsFarmerModalOpen(!isFarmerModalOpen);
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
    setIsFarmerModalOpen(false);
  };
  const registerFarmer = async () => {
    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `https://iinms.brri.gov.bd/api/farmers/farmers/${selectedId}`
        : "https://iinms.brri.gov.bd/api/farmers/farmers";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setIsFarmerModalOpen(false);
        setIsEdit(false); // reset edit mode
        console.log("SAAO saved successfully:", data);
        fetchFarmers(); // Refresh the list
      } else {
        throw new Error("Failed to save SAAO");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleDeleteSAAO = async (id) => {
    try {
      const response = await fetch(`https://iinms.brri.gov.bd/api/farmers/farmers/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("SAAO deleted successfully");
        fetchFarmers(); // Refresh the list
      } else {
        throw new Error("Failed to delete SAAO");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // Filter farmerList based on search text
  const filteredFarmers = farmerList.filter((farmer) => {
    return (
      farmer.name.toLowerCase().includes(searchText.toLowerCase()) ||
      farmer.mobileNumber.includes(searchText) ||
      farmer.email.toLowerCase().includes(searchText.toLowerCase())
    );
  });
  const handleSelect = (e) => {
    const selectedValue = e.target.value;
    // Check if the value is already selected
    if (!selectedHotspots.includes(selectedValue)) {
      const updatedHotspots = [...selectedHotspots, selectedValue];
      setSelectedHotspots(updatedHotspots);
      setFormData({
        ...formData,
        hotspot: updatedHotspots, // Update the formData with the new hotspots list
      });
    }
  }

  const handleDelete = (valueToDelete) => {
    // Remove selected value
    const updatedHotspot = selectedHotspots.filter((value) => value !== valueToDelete);
    setSelectedHotspots(updatedHotspot);
  };
  const handleEdit = (SAAO) => {
    setIsEdit(true);
    setIsFarmerModalOpen(true);
    setSelectedHotspots(SAAO.hotspot || []);
    setSelectedId(SAAO.id);

    setFormData({
      name: SAAO.name || "",
      fatherName: SAAO.fatherName || "",
      gender: SAAO.gender || "",
      mobileNumber: SAAO.mobileNumber || "",
      whatsappNumber: SAAO.whatsappNumber || "",
      imoNumber: SAAO.imoNumber || "",
      messengerId: SAAO.messengerId || "",
      email: SAAO.email || "",
      alternateContact: SAAO.alternateContact || "",
      nationalId: SAAO.nationalId || "",
      agrilCard: SAAO.agrilCard || "",
      educationStatus: SAAO.educationStatus || "",
      // Location
      village: SAAO.village || "",
      block: SAAO.block || "",
      union: SAAO.union || "",
      upazila: SAAO.upazila || "",
      district: SAAO.district || "",
      division: SAAO.division || "",
      region: SAAO.region || "",
      coordinates: SAAO.coordinates || "",
      hotspot: SAAO.hotspot || [],
      // Rice Crop Details
      farmSize: SAAO.farmSize || "",
      landType: SAAO.landType || "",
      cultivationSeason: SAAO.cultivationSeason || "",
      majorCrops: SAAO.majorCrops || "",
      croppingPattern: SAAO.croppingPattern || "",
      riceVarieties: SAAO.riceVarieties || "",
      plantingMethod: SAAO.plantingMethod || "",
      irrigationPractices: SAAO.irrigationPractices || "",
      fertilizerUsage: SAAO.fertilizerUsage || "",
      soilType: SAAO.soilType || "",
      avgProduction: SAAO.avgProduction || "",
      // Stage-wise Crop Management
      plantingDate: SAAO.plantingDate || "",
      seedlingAge: SAAO.seedlingAge || "",
      transplantationDate: SAAO.transplantationDate || "",
      wateringStages: SAAO.wateringStages || "",
      harvestDate: SAAO.harvestDate || "",
      pestDiseases: SAAO.pestDiseases || "",
      weedManagement: SAAO.weedManagement || "",
      role: "farmer",
      eduOther: SAAO.eduOther || "",
    });
  };

  return (
    <div className="min-h-screen w-full bg-gray-100">

      {/* Main Content */}
      <main className=" p-6">
        <div className="container mx-auto bg-white rounded-lg shadow-md p-6 ">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Farmer List</h1>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={toggleFarmerModal}
            >
              + Add Farmer
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
                <option value={100}>Show 100</option>
                <option value={500}>Show 500</option>
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
                {filteredFarmers.slice(0, rowsPerPage).map(farmer => (
                  <tr key={farmer.id}>
                    {columns
                      .filter((col) => col.visible)
                      .map((col) => (
                        <td key={col.name} className="border px-4 py-2">
                          {/* Render farmer data dynamically based on column names */}
                          {col.name === "ID" && farmer.id}
                          {col.name === "Farmer Name" && farmer.name}
                          {col.name === "Father Name" && farmer.fatherName}
                          {col.name === "Gender" && farmer.gender}
                          {col.name === "Mobile Number" && farmer.mobileNumber}
                          {col.name === "Whatsapp Number" && farmer.whatsappNumber}
                          {col.name === "Imo Number" && farmer.imoNumber}
                          {col.name === "Messenger ID" && farmer.messengerId}
                          {col.name === "Email" && farmer.email}
                          {col.name === "Alternate Contact" && farmer.alternateContact}
                          {col.name === "National ID" && farmer.nationalId}
                          {col.name === "Agriculture Card" && farmer.agrilCard}
                          {col.name === "Education Status" && farmer.educationStatus}
                          {col.name === "Village" && farmer.village}
                          {col.name === "Block" && farmer.block}
                          {col.name === "Union" && farmer.union}
                          {col.name === "Upazila" && farmer.upazila}
                          {col.name === "District" && farmer.district}
                          {col.name === "Division" && farmer.division}
                          {col.name === "Region" && farmer.region}
                          {col.name === "Coordinates" && farmer.coordinates}
                          {col.name === "Hotspot" && farmer.hotspot && farmer.hotspot.join(", ")}
                          {col.name === "Farm Size" && farmer.farmSize}
                          {col.name === "Land Type" && farmer.landType}
                          {col.name === "Cultivation Season" && farmer.cultivationSeason}
                          {col.name === "Major Crops" && farmer.majorCrops}
                          {col.name === "Cropping Pattern" && farmer.croppingPattern}
                          {col.name === "Rice Varieties" && farmer.riceVarieties}
                          {col.name === "Planting Method" && farmer.plantingMethod}
                          {col.name === "Irrigation Practices" && farmer.irrigationPractices}
                          {col.name === "Fertilizer Usage" && farmer.fertilizerUsage}
                          {col.name === "Soil Type" && farmer.soilType}
                          {col.name === "Action" && (
                            <div className="flex space-x-2">
                              <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" onClick={() => handleEdit(farmer)}>
                                <FaEdit />
                              </button>
                              <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => handleDeleteSAAO(farmer.id)}>
                                <FaTrash />
                              </button>
                            </div>
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

        {/* Farmer Modal */}
        {isFarmerModalOpen && (
          <div className=" fixed inset-0 z-[999999] bg-black bg-opacity-50 flex items-center justify-center">
            <div className="relative max-h-[90vh] overflow-y-scroll  bg-white p-6 rounded-lg shadow-lg w-full  md:w-2/3 lg:w-2/3">
              <h3 className="text-lg font-semibold mb-4">Farmer Registration</h3>
              <button
                className="absolute top-2 right-5 text-xl text-gray-500 hover:text-gray-800"
                onClick={closeModal}
              >
                &times;
              </button>
              <form>
                {/* Step 1: Farmer Identification */}
                <div className={`space-y-4 ${currentStep === 1 ? "" : "hidden"}`}>
                  <h1 className="text-xl">Personal Information</h1>
                  <input
                    type="text"
                    name="name"
                    placeholder="Farmer's Name"
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
                    type="number"
                    name="age"
                    placeholder="Age"
                    className="border w-full p-2 rounded"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
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
                  <input
                    type="text"
                    name="agrilCard"
                    placeholder="Agril Card No"
                    className="border w-full p-2 rounded"
                    value={formData.agrilCard}
                    onChange={handleChange}
                  />
                  <select
                    name="educationStatus"
                    className="border w-full p-2 rounded"
                    value={formData.educationStatus}
                    onChange={handleChange}
                  >
                    <option value="">Select Education Status</option>
                    <option value="illiterate">Illiterate</option>
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="higher">Higher</option>
                    <option value="other">Other</option>
                  </select>
                  {
                    formData.educationStatus === 'other' && <input type="text" name="eduOther" placeholder="Education Status" className="border w-full p-2 mt-2 rounded" value={formData.eduOther}

                      onChange={handleChange} />
                  }
                </div>

                {/* Step 2: Location Information */}
                <div className={`space-y-4 ${currentStep === 2 ? "" : "hidden"}`}>
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
                    value=""
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
                  <select
                    name="region"
                    className="border w-full p-2 rounded"
                    value={formData.region}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Region</option>
                    {regions?.map((hotspot) => (
                      <option key={hotspot} value={hotspot}>
                        {hotspot}
                      </option>
                    ))}
                  </select>
                  <select
                    name="division"
                    className="border w-full p-2 rounded"
                    value={formData.division}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Division</option>
                    {divisions?.map((division) => (
                      <option key={division} value={division}>
                        {division}
                      </option>
                    ))}
                  </select>
                  <select
                    name="district"
                    className="border w-full p-2 rounded"
                    value={formData.district}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select District</option>
                    {districts?.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  <select
                    name="upazila"
                    className="border w-full p-2 rounded"
                    value={formData.upazila}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Upazila</option>
                    {upazilas?.map((upazila) => (
                      <option key={upazila} value={upazila}>
                        {upazila}
                      </option>
                    ))}
                  </select>
                  <select
                    name="union"
                    className="border w-full p-2 rounded"
                    value={formData.union}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Union</option>
                    {unions?.map((union) => (
                      <option key={union} value={union}>
                        {union}
                      </option>
                    ))}
                  </select>
                  <select
                    name="block"
                    className="border w-full p-2 rounded"
                    value={formData.block}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Block</option>
                    {block?.map((block) => (
                      <option key={block} value={block}>
                        {block}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="village"
                    placeholder="Village/Locality"
                    className="border w-full p-2 rounded"
                    value={formData.village}
                    onChange={handleChange}
                  />
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
                </div>


                {/* Step 3: Rice Crop Details */}
                <div className={`space-y-4 ${currentStep === 3 ? "" : "hidden"}`}>
                  <h1 className="text-xl">Farming Information</h1>
                  <input
                    type="text"
                    name="farmSize"
                    placeholder="Farm Size (in acres/hectares)"
                    className="border w-full p-2 rounded"
                    value={formData.farmSize}
                    onChange={handleChange}
                  />
                  <select
                    name="landType"
                    className="border w-full p-2 rounded"
                    value={formData.landType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Land Type</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <select
                    name="cultivationSeason"
                    className="border w-full p-2 rounded"
                    value={formData.cultivationSeason}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Season</option>
                    <option value="aus">Aus</option>
                    <option value="aman">Aman</option>
                    <option value="boro">Boro</option>
                  </select>
                  <select
                    name="majorCrops"
                    className="border w-full p-2 rounded"
                    value={formData.majorCrops}
                    onChange={handleChange}
                  >
                    <option value="">Select Major Crops</option>
                    <option value="rice">Rice</option>
                    <option value="wheat">Wheat</option>
                    <option value="maize">Maize</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="others">Others</option>
                  </select>

                  <select
                    name="plantingMethod"
                    className="border w-full p-2 rounded"
                    value={formData.plantingMethod}
                    onChange={handleChange}
                  >
                    <option value="">Select Planting Method</option>
                    <option value="directSeeding">Direct Seeding</option>
                    <option value="transplanting">Transplanting</option>
                  </select>

                  <select
                    name="irrigationPractices"
                    className="border w-full p-2 rounded"
                    value={formData.irrigationPractices}
                    onChange={handleChange}
                  >
                    <option value="">Select Irrigation Practices</option>
                    <option value="AWD">AWD</option>
                    <option value="continuousFlooding">Continuous Flooding</option>
                    <option value="others">Others</option>
                  </select>

                  <select
                    name="soilType"
                    className="border w-full p-2 rounded"
                    value={formData.soilType}
                    onChange={handleChange}
                  >
                    <option value="">Select Soil Type</option>
                    <option value="clay">Clay</option>
                    <option value="clayLoam">Clay Loam</option>
                    <option value="sandy">Sandy</option>
                    <option value="silt">Silt</option>
                    <option value="sandyLoam">Sandy Loam</option>
                    <option value="others">Others</option>
                  </select>

                  <input
                    type="text"
                    name="croppingPattern"
                    placeholder="Cropping Pattern"
                    className="border w-full p-2 rounded"
                    value={formData.croppingPattern}
                    onChange={handleChange}
                  />

                  <input
                    type="text"
                    name="riceVarieties"
                    placeholder="Rice Varieties"
                    className="border w-full p-2 rounded"
                    value={formData.riceVarieties}
                    onChange={handleChange}
                  />

                  <input
                    type="text"
                    name="fertilizerUsage"
                    placeholder="Fertilizer Usage (Urea)/season"
                    className="border w-full p-2 rounded"
                    value={formData.fertilizerUsage}
                    onChange={handleChange}
                  />

                  {/* <input
                    type="text"
                    name="avgProduction"
                    placeholder="Average Production (e.g., per season/year)"
                    className="border w-full p-2 rounded"
                    value={formData.avgProduction}
                    onChange={handleChange}
                  /> */}
                </div>


                {/* Step 4: Crop Management */}
                {/* <div className={`space-y-4 ${currentStep === 4 ? "" : "hidden"}`}>
                  <input
                    type="date"
                    name="plantingDate"
                    placeholder="Planned Planting/Sowing Date"
                    className="border w-full p-2 rounded"
                    value={formData.plantingDate}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="seedlingAge"
                    placeholder="Seedling Age (in days)"
                    className="border w-full p-2 rounded"
                    value={formData.seedlingAge}
                    onChange={handleChange}
                  />
                  <input
                    type="date"
                    name="transplantationDate"
                    placeholder="Planned Transplantation Date"
                    className="border w-full p-2 rounded"
                    value={formData.transplantationDate}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="wateringStages"
                    placeholder="Key Watering Stages"
                    className="border w-full p-2 rounded"
                    value={formData.wateringStages}
                    onChange={handleChange}
                  />
                  <input
                    type="date"
                    name="harvestDate"
                    placeholder="Planned Harvest Date"
                    className="border w-full p-2 rounded"
                    value={formData.harvestDate}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="pestDiseases"
                    placeholder="Pest and Disease Management"
                    className="border w-full p-2 rounded"
                    value={formData.pestDiseases}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="weedManagement"
                    placeholder="Weed Management Practices"
                    className="border w-full p-2 rounded"
                    value={formData.weedManagement}
                    onChange={handleChange}
                  />
                </div> */}

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
                {currentStep === 3 ?
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={registerFarmer}
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

export default FarmerRegistration
