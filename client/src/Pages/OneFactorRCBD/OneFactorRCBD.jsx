import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import Papa from "papaparse";
import { ChevronsUpDown } from "lucide-react";
import { HashLoader } from "react-spinners";
 
export default function OneFactorRCBD() {
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState({
    treatmentOptions: [],
    replicationOptions: [],
    testOptions: [],
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading , setLoading] = useState(false);
  const [selected, setSelected] = useState({
    replication: "",
    treatment: "",
    variable: "",
    test: "",
  });
  const [anovaResult, setAnovaResult] = useState("");

  // Handle file upload and extract column names
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    if (uploadedFile) {
      Papa.parse(uploadedFile, {
        complete: (result) => {
          const columnNames = result.meta.fields || [];
          setColumns({
            treatmentOptions: columnNames,
            replicationOptions: columnNames,
            testOptions: columnNames,
          });
        },
        header: true,
      });
    }
  };

  // Handle dropdown changes
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setSelected((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form to backend
  const handleSubmit = async () => {
    if (!file) return alert("Please upload a CSV file");
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("replication", selected.replication);
    formData.append("treatment", selected.treatment);
    formData.append("variable", selected.variable);
    formData.append("test", selected.test);

    try {
      const response = await fetch("http://localhost:5002/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);

      if (data) {
        console.log(data);

        setAnovaResult(data);
        setModalOpen(true);
        setLoading(false);
      } else {
        setAnovaResult("Error processing data");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setAnovaResult("Failed to connect to the server");
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white w-full">
        <HashLoader />
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center justify-center  bg-gray-100 min-h-screen ">

      <div className="bg-white shadow-lg rounded-lg w-fit">
        <h1 className="text-2xl text-center font-bold mb-6 my-5">ONE FACTOR RCBD</h1>
        <div className="w-full max-w-7xl bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row gap-6">
          <div className="w-full  border p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Research Form</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Upload CSV</label>
                <input type="file" onChange={handleFileUpload} className="w-full border px-2 py-[5px] rounded" />
              </div>

              <div>
                <label className="block font-medium">Replication</label>
                <select
                  name="replication"
                  value={selected.replication}
                  onChange={handleSelectChange}
                  className="w-full border p-2 rounded"
                >
                  <option>Select Replication</option>
                  {columns.replicationOptions.map((column, index) => (
                    <option key={index} value={column}>{column}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium">Treatment</label>
                <select
                  name="treatment"
                  value={selected.treatment}
                  onChange={handleSelectChange}
                  className="w-full border p-2 rounded"
                >
                  <option>Select Treatment</option>
                  {columns.treatmentOptions.map((column, index) => (
                    <option key={index} value={column}>{column}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium">Variable</label>
                <select
                  name="variable"
                  value={selected.variable}
                  onChange={handleSelectChange}
                  className="w-full border p-2 rounded"
                >
                  <option>Select Variable</option>
                  {columns.testOptions.map((column, index) => (
                    <option key={index} value={column}>{column}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block font-medium">Multiple Comparison Test</label>
                <select
                  name="test"
                  value={selected.test}
                  onChange={handleSelectChange}
                  className="w-full border p-2 rounded"
                >
                  <option>Select Test</option>
                  <option value="LSD">LSD</option>
                  <option value="Tukey">Tukey</option>
                  <option value="Duncan">DMRT</option>
                </select>
              </div>

              <div className="col-span-2">
                <button
                  onClick={handleSubmit}
                  className="bg-gray-600 w-full text-white px-6 py-2 rounded-lg hover:bg-gray-500"
                >
                  SUBMIT
                </button>
              </div>
            </div>

            {anovaResult && <AnovaTableModal
              anovaResult={anovaResult}
              isOpen={isModalOpen}
              onClose={() => setModalOpen(false)}
            />}
          </div>

          {/* <div className="w-full md:w-1/3 border p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Tutorial</h2>
          <div className="flex justify-center">
            <iframe
              width="300"
              height="200"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="YouTube Tutorial"
              allowFullScreen
            ></iframe>
          </div>
          <div className="mt-4 flex flex-col space-y-2">
            <a href="#" className="text-green-600 hover:underline">Input File</a>
            <a href="#" className="text-green-600 hover:underline">Output Report</a>
            <a href="#" className="text-green-600 hover:underline">Methodology</a>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="bg-green-500 text-white px-6 py-2 rounded-lg flex items-center gap-2">
              <FaWhatsapp />
              <span>Need Help?</span>
            </button>
          </div>
        </div> */}
        </div>
      </div>
    </div>
  );
}

// const sampleAnovaResult = {
//   statistics: [
//     {
//       MSerror: 4.423e-31,
//       Df: 4,
//       Mean: 4.7667,
//       CV: 1.3952e-14,
//       "t.value": 2.7764,
//       LSD: 1.5077e-15,
//       _row: " ",
//     },
//   ],
//   parameters: [
//     {
//       test: "Fisher-LSD",
//       "p.ajusted": "none",
//       "name.t": "Fertilizer",
//       ntr: 3,
//       alpha: 0.05,
//       _row: " ",
//     },
//   ],
//   means: [
//     {
//       "Yield (kg/plot)": 4.3,
//       std: 0.1,
//       r: 3,
//       se: 3.8397e-16,
//       LCL: 4.3,
//       UCL: 4.3,
//       Min: 4.2,
//       Max: 4.4,
//       Q25: 4.25,
//       Q50: 4.3,
//       Q75: 4.35,
//       _row: "F1",
//     },
//     {
//       "Yield (kg/plot)": 4.9,
//       std: 0.1,
//       r: 3,
//       se: 3.8397e-16,
//       LCL: 4.9,
//       UCL: 4.9,
//       Min: 4.8,
//       Max: 5,
//       Q25: 4.85,
//       Q50: 4.9,
//       Q75: 4.95,
//       _row: "F2",
//     },
//     {
//       "Yield (kg/plot)": 5.1,
//       std: 0.1,
//       r: 3,
//       se: 3.8397e-16,
//       LCL: 5.1,
//       UCL: 5.1,
//       Min: 5,
//       Max: 5.2,
//       Q25: 5.05,
//       Q50: 5.1,
//       Q75: 5.15,
//       _row: "F3",
//     },
//   ],
//   groups: [
//     {
//       "Yield (kg/plot)": 5.1,
//       groups: "a",
//       _row: "F3",
//     },
//     {
//       "Yield (kg/plot)": 4.9,
//       groups: "b",
//       _row: "F2",
//     },
//     {
//       "Yield (kg/plot)": 4.3,
//       groups: "c",
//       _row: "F1",
//     },
//   ],
// };


function Table({ title, data }) {
  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]).filter((key) => key !== "_row");

  return (
    <div className="mb-8 border shadow-md p-5">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="overflow-x-auto bg-white ">
        <table className="min-w-full text-sm border text-gray-700">
          <thead className=" text-black">
            <tr className="bg-gray-50 text-sm border-b">
              {headers.map((head) => (
                <th key={head} className="px-4 py-2 border text-center">
                  <p className="flex items-center justify-between">{head} <ChevronsUpDown size={14} /></p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y ">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 border">
                {headers.map((head) => (
                  <td key={head} className="px-4 py-2 border  text-center">
                    {row[head] !== undefined ? row[head].toString() : "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


const AnovaTableModal = ({ anovaResult, isOpen, onClose }) => {
  if (!isOpen || !anovaResult) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose} // Close modal if background clicked
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-6xl w-full max-h-[80vh] overflow-auto p-6"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <button
          onClick={onClose}
          className="float-right text-gray-600 hover:text-gray-900 text-xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">ANOVA Analysis Result</h2>

        <Table title="ANOVA Table" data={anovaResult.anova_table} />
        <Table title="Statistics" data={anovaResult.statistics} />
        <Table title="Parameters" data={anovaResult.parameters} />
        <Table title="Means" data={anovaResult.means} />
        <Table title="Groups" data={anovaResult.groups} />
      </div>
    </div>
  );
};



