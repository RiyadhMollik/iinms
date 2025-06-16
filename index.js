import mqtt from "mqtt";
import express from 'express';
import path from "path";
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import userRoutes from './routes/userRoutes.js';
import sequelize from './config/db.js';
import roleRoutes from "./routes/roleRoutes.js";
import blockRoutes from "./routes/blockRoutes.js";
import upazilaRoutes from "./routes/upazilaRoutes.js";
import districtRoutes from "./routes/districtRoutes.js";
import divisionRoutes from "./routes/divisionRoutes.js";
import regionRoutes from "./routes/regionRoutes.js";
import weatherParameterRoutes from "./routes/weatherParameterRoutes.js";
import hotspotRoutes from "./routes/hotspotRoutes.js";
import aezRoutes from "./routes/aezRoutes.js";
import csaRoutes from "./routes/csaRoutes.js";
import farmerRoutes from "./routes/registedUserRoutes.js";
import saaOFormRoutes from "./routes/saaOFormRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import unionRoutes from './routes/unionRoutes.js';
import dataRoutes from "./routes/dataRoutes.js";
import weatherRoutes from './routes/weatherRoutes.js';
import statsRoutes from "./routes/statsRoutes.js";
import sunshineRoutes from "./routes/sunshineRoutes.js";
import deviceRoutes from './routes/deviceRoutes.js';
import upload from "./middleware/upload.js";
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use("/api/bloks", blockRoutes);
app.use("/api/upazila", upazilaRoutes);
app.use("/api/district", districtRoutes);
app.use("/api/division", divisionRoutes);
app.use("/api/region", regionRoutes);
app.use("/api/weather-parameters", weatherParameterRoutes);
app.use("/api/hotspots", hotspotRoutes);
app.use("/api/aezs", aezRoutes);
app.use("/api/csas", csaRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/saaOForms", saaOFormRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use('/api/unions', unionRoutes);
app.use("/api/data", dataRoutes);
app.use('/api/weather', weatherRoutes);
app.use("/api/stats", statsRoutes);
app.use('/api/devices', deviceRoutes);
app.use(express.static(path.join(__dirname, "/client/dist")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', sunshineRoutes);
// app.use('/uploads', express.static('uploads')); 

// Upload route
app.post('/api/upload', upload.single('profileImage'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const imageUrl = `https://saads.brri.gov.bd/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

const brokerIP = "180.211.163.243";
const brokerPort = 1883;
const pumpID = "112233"; // Static pump ID for now
const topic = `PL/BRRI/${pumpID}`;

// Connect to MQTT broker
const client = mqtt.connect(`mqtt://${brokerIP}:${brokerPort}`);

client.on("connect", () => {
  console.log("Connected to MQTT Broker");
});

const publishMessage = (message) => {
  client.publish(topic, message, (err) => {
    if (err) {
      console.error("Failed to send message:", err);
    } else {
      console.log(`Message '${message}' sent to topic '${topic}'`);
    }
  });
};

// API Routes to control pump
app.post("/pump/start", (req, res) => {
  publishMessage("set:pump=on");
  res.json({ message: "Pump turned ON" });
});

app.post("/pump/stop", (req, res) => {
  publishMessage("set:pump=off");
  res.json({ message: "Pump turned OFF" });
});

app.post("/pump/auto-on", (req, res) => {
  publishMessage("set:mode=on");
  res.json({ message: "Pump set to Auto Mode" });
});

app.post("/pump/auto-off", (req, res) => {
  publishMessage("set:mode=off");
  res.json({ message: "Pump set to Manual Mode" });
});

app.get("/", (req, res) => {
  res.send("Hello to online API");
});
const publicPath = path.join(__dirname, 'public');
if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath);
}

const csvFilePath = path.join(publicPath, 'numbers.csv');

// Write CSV header if the file does not exist
if (!fs.existsSync(csvFilePath)) {
  fs.writeFileSync(csvFilePath, 'mobile,phone\n');
}

// API endpoint
app.post('/api/save-number', (req, res) => {
  const { mobile, phone } = req.body;

  if (!mobile || !phone) {
    return res.status(400).json({ message: 'Mobile and phone are required' });
  }

  const line = `${mobile},${phone}\n`;

  fs.appendFile(csvFilePath, line, (err) => {
    if (err) {
      console.error('Error writing to CSV:', err);
      return res.status(500).json({ message: 'Failed to save data' });
    }
    res.status(200).json({ message: 'Data saved successfully' });
  });
});

app.listen(PORT, () => {
  sequelize.sync()
  console.log(`Server Running on port ${PORT}`);
});
