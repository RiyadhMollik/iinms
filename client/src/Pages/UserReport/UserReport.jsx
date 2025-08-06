import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import dayjs from 'dayjs';
import axios from 'axios';
import Papa from 'papaparse';

const UserReport = () => {
  const [userData, setUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([
    {
      startDate: addDays(new Date(), -30),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSaao, setSelectedSaao] = useState('all');
  const [saaos, setSaaos] = useState([]);

  // Sample data for demonstration
  const sampleData = [
    {
      id: 1,
      farmerId: 101,
      saaoId: 201,
      farmerName: 'Abdul Rahman',
      phone: '+8801712345678',
      village: 'Dhaka Village',
      formData: {
        0: { irrigation: ['Sprinkler'], other: { notes: 'Good irrigation system' } },
        1: { other: { notes: 'Soil preparation completed' } },
        2: { other: { notes: 'Seed selection done' } },
        3: { herbicide: ['Glyphosate'], other: { notes: 'Weed control applied' } },
        4: { other: { notes: 'Fertilizer planning' } },
        5: { fertilizer: ['NPK', 'Urea'], other: { notes: 'Nutrient management' } },
        6: { other: { notes: 'Water management' } },
        7: { pesticide: ['Neem oil'], other: { notes: 'Pest control' } },
        8: { fungicide: ['Copper sulfate'], other: { notes: 'Disease prevention' } },
        9: { other: { notes: 'Harvest planning' } },
        10: { other: { notes: 'Post-harvest care' } },
        11: { other: { notes: 'Storage preparation' } }
      },
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: 2,
      farmerId: 102,
      saaoId: 202,
      farmerName: 'Fatima Begum',
      phone: '+8801723456789',
      village: 'Chittagong Village',
      formData: {
        0: { irrigation: ['Drip'], other: { notes: 'Efficient water use' } },
        1: { other: { notes: 'Organic farming approach' } },
        2: { other: { notes: 'Local seed varieties' } },
        3: { herbicide: [], other: { notes: 'Manual weeding preferred' } },
        4: { other: { notes: 'Natural pest control' } },
        5: { fertilizer: ['Compost'], other: { notes: 'Organic fertilizers' } },
        6: { other: { notes: 'Sustainable practices' } },
        7: { pesticide: [], other: { notes: 'Biological control' } },
        8: { fungicide: [], other: { notes: 'Preventive measures' } },
        9: { other: { notes: 'Quality focus' } },
        10: { other: { notes: 'Market preparation' } },
        11: { other: { notes: 'Value addition' } }
      },
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18'
    },
    {
      id: 3,
      farmerId: 103,
      saaoId: 201,
      farmerName: 'Mohammad Ali',
      phone: '+8801734567890',
      village: 'Sylhet Village',
      formData: {
        0: { irrigation: ['Flood'], other: { notes: 'Traditional method' } },
        1: { other: { notes: 'Rice cultivation focus' } },
        2: { other: { notes: 'High-yield varieties' } },
        3: { herbicide: ['2,4-D'], other: { notes: 'Chemical weed control' } },
        4: { other: { notes: 'Intensive farming' } },
        5: { fertilizer: ['NPK', 'DAP'], other: { notes: 'Balanced nutrition' } },
        6: { other: { notes: 'Water level monitoring' } },
        7: { pesticide: ['Carbaryl'], other: { notes: 'Pest management' } },
        8: { fungicide: ['Mancozeb'], other: { notes: 'Disease control' } },
        9: { other: { notes: 'Yield optimization' } },
        10: { other: { notes: 'Quality maintenance' } },
        11: { other: { notes: 'Storage facilities' } }
      },
      createdAt: '2024-01-12',
      updatedAt: '2024-01-25'
    }
  ];

  useEffect(() => {
    fetchUserData();
    fetchSaaos();
  }, []);

  const fetchSaaos = async () => {
    try {
      // This would be replaced with actual API call to get SAAO list
      const sampleSaaos = [
        { id: 201, name: 'SAAO Dhaka' },
        { id: 202, name: 'SAAO Chittagong' },
        { id: 203, name: 'SAAO Sylhet' }
      ];
      setSaaos(sampleSaaos);
    } catch (error) {
      console.error('Error fetching SAAOs:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const startDate = dayjs(dateRange[0].startDate).format('YYYY-MM-DD');
      const endDate = dayjs(dateRange[0].endDate).format('YYYY-MM-DD');
      
      const response = await axios.get(`/api/wabas-validation-data/report/user-data`, {
        params: {
          startDate,
          endDate,
          saaoId: selectedSaao !== 'all' ? selectedSaao : '',
          limit: 1000
        }
      });

      if (response.data.success) {
        setUserData(response.data.data);
        setFilteredData(response.data.data);
      } else {
        // Fallback to sample data if API fails
        setUserData(sampleData);
        setFilteredData(sampleData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback to sample data
      setUserData(sampleData);
      setFilteredData(sampleData);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const csvData = filteredData.map(item => ({
      'Farmer ID': item.farmerId,
      'Farmer Name': item.farmerName,
      'Phone': item.phone,
      'Village': item.village,
      'SAAO ID': item.saaoId,
      'Created Date': dayjs(item.createdAt).format('YYYY-MM-DD'),
      'Updated Date': dayjs(item.updatedAt).format('YYYY-MM-DD'),
      'Irrigation Methods': getIrrigationMethods(item.formData),
      'Fertilizers Used': getFertilizersUsed(item.formData),
      'Pesticides Used': getPesticidesUsed(item.formData),
      'Fungicides Used': getFungicidesUsed(item.formData),
      'Herbicides Used': getHerbicidesUsed(item.formData)
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `user_report_${dayjs().format('YYYY-MM-DD')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    filterData();
  }, [userData, searchTerm, selectedSaao]);

  useEffect(() => {
    fetchUserData();
  }, [dateRange, selectedFilter]);

  const filterData = () => {
    let filtered = [...userData];

    // SAAO filter
    if (selectedSaao !== 'all') {
      filtered = filtered.filter(item => item.saaoId == selectedSaao);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        (item.farmerName && item.farmerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.phone && item.phone.includes(searchTerm)) ||
        (item.village && item.village.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredData(filtered);
  };

  // Helper functions for data extraction
  const getIrrigationMethods = (formData) => {
    return formData[0]?.irrigation?.join(', ') || 'None';
  };

  const getFertilizersUsed = (formData) => {
    return formData[5]?.fertilizer?.join(', ') || 'None';
  };

  const getPesticidesUsed = (formData) => {
    return formData[7]?.pesticide?.join(', ') || 'None';
  };

  const getFungicidesUsed = (formData) => {
    return formData[8]?.fungicide?.join(', ') || 'None';
  };

  const getHerbicidesUsed = (formData) => {
    return formData[3]?.herbicide?.join(', ') || 'None';
  };

  // Chart data preparation
  const getVillageDistribution = () => {
    const villageCount = {};
    filteredData.forEach(item => {
      const village = item.village || 'Unknown';
      villageCount[village] = (villageCount[village] || 0) + 1;
    });
    return Object.entries(villageCount).map(([village, count]) => ({ village, count }));
  };

  const getSaaoDistribution = () => {
    const saaoCount = {};
    filteredData.forEach(item => {
      const saaoName = saaos.find(s => s.id == item.saaoId)?.name || `SAAO ${item.saaoId}`;
      saaoCount[saaoName] = (saaoCount[saaoName] || 0) + 1;
    });
    return Object.entries(saaoCount).map(([saaoName, count]) => ({ saaoName, count }));
  };

  const getSubmissionTrend = () => {
    const dailyCount = {};
    filteredData.forEach(item => {
      const date = dayjs(item.createdAt).format('YYYY-MM-DD');
      dailyCount[date] = (dailyCount[date] || 0) + 1;
    });
    return Object.entries(dailyCount).map(([date, count]) => ({ date, count }));
  };

  const getFormCompletionStats = () => {
    const stats = {
      totalUsers: filteredData.length,
      withIrrigation: filteredData.filter(item => getIrrigationMethods(item.formData) !== 'None').length,
      withFertilizers: filteredData.filter(item => getFertilizersUsed(item.formData) !== 'None').length,
      withPesticides: filteredData.filter(item => getPesticidesUsed(item.formData) !== 'None').length,
      withFungicides: filteredData.filter(item => getFungicidesUsed(item.formData) !== 'None').length,
      withHerbicides: filteredData.filter(item => getHerbicidesUsed(item.formData) !== 'None').length
    };

    stats.avgCompletionRate = Math.round(
      ((stats.withIrrigation + stats.withFertilizers + stats.withPesticides + 
        stats.withFungicides + stats.withHerbicides) / (stats.totalUsers * 5)) * 100
    );

    return stats;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">User Data Report</h1>
          <p className="text-gray-600">Comprehensive analysis of all users and their submitted farming data</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date Range Picker */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <input
                type="text"
                value={`${dayjs(dateRange[0].startDate).format('MMM DD, YYYY')} - ${dayjs(dateRange[0].endDate).format('MMM DD, YYYY')}`}
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                readOnly
              />
              {showDatePicker && (
                <div className="absolute z-10 mt-1">
                  <DateRangePicker
                    ranges={dateRange}
                    onChange={item => setDateRange([item.selection])}
                    onClose={() => setShowDatePicker(false)}
                  />
                </div>
              )}
            </div>

            {/* SAAO Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SAAO</label>
              <select
                value={selectedSaao}
                onChange={(e) => setSelectedSaao(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All SAAOs</option>
                {saaos.map(saao => (
                  <option key={saao.id} value={saao.id}>{saao.name}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by farmer name, phone, village..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Summary Stats */}
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-600 font-medium">Total Users</p>
              <p className="text-2xl font-bold text-blue-800">{filteredData.length}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={fetchUserData}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  Refresh
                </button>
                <button
                  onClick={exportToCSV}
                  className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                >
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Statistics Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-sm font-medium text-gray-500">Total Users</h4>
                <p className="text-2xl font-bold text-blue-600">{getFormCompletionStats().totalUsers}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-sm font-medium text-gray-500">With Irrigation</h4>
                <p className="text-2xl font-bold text-green-600">{getFormCompletionStats().withIrrigation}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-sm font-medium text-gray-500">With Fertilizers</h4>
                <p className="text-2xl font-bold text-yellow-600">{getFormCompletionStats().withFertilizers}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-sm font-medium text-gray-500">With Pesticides</h4>
                <p className="text-2xl font-bold text-red-600">{getFormCompletionStats().withPesticides}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-sm font-medium text-gray-500">With Fungicides</h4>
                <p className="text-2xl font-bold text-purple-600">{getFormCompletionStats().withFungicides}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-sm font-medium text-gray-500">With Herbicides</h4>
                <p className="text-2xl font-bold text-indigo-600">{getFormCompletionStats().withHerbicides}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-sm font-medium text-gray-500">Completion Rate</h4>
                <p className="text-2xl font-bold text-orange-600">{getFormCompletionStats().avgCompletionRate}%</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Village Distribution */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Users by Village</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getVillageDistribution()} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="village" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Submission Trend */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily User Registration Trend</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getSubmissionTrend()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#00C49F" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Additional Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* SAAO Distribution */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Users by SAAO</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getSaaoDistribution()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ saaoName, percent }) => `${saaoName} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {getSaaoDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Form Completion Rate */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Form Completion Analysis</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { category: 'Irrigation', count: getFormCompletionStats().withIrrigation },
                      { category: 'Fertilizers', count: getFormCompletionStats().withFertilizers },
                      { category: 'Pesticides', count: getFormCompletionStats().withPesticides },
                      { category: 'Fungicides', count: getFormCompletionStats().withFungicides },
                      { category: 'Herbicides', count: getFormCompletionStats().withHerbicides }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#FFBB28" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">User Data Table</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Village</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAAO</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Irrigation</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fertilizers</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pesticides</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.farmerId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.farmerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.village}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {saaos.find(s => s.id == item.saaoId)?.name || `SAAO ${item.saaoId}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            getIrrigationMethods(item.formData) !== 'None' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {getIrrigationMethods(item.formData)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            getFertilizersUsed(item.formData) !== 'None' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {getFertilizersUsed(item.formData)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            getPesticidesUsed(item.formData) !== 'None' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {getPesticidesUsed(item.formData)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.updatedAt ? dayjs(item.updatedAt).format('MMM DD, YYYY') : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserReport; 