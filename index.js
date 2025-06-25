import mqtt from "mqtt";
import express from 'express';
import path from "path";
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import nodemailer from 'nodemailer';
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
import surveyRoutes from './routes/surveyRoutes.js';
import upload from "./middleware/upload.js";
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.json({ limit: "50mb" }));

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
app.use('/api/surveys', surveyRoutes);
app.use(express.static(path.join(__dirname, "/client/dist")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', sunshineRoutes);
// app.use('/uploads', express.static('uploads')); 

// Upload route
app.post('/api/upload', upload.single('profileImage'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const imageUrl = `https://iinms.brri.gov.bd/uploads/${req.file.filename}`;
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
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "niaz.sust@gmail.com", // Replace with your Gmail
        pass: "yibw sjul qonb bnap", // Replace with your app-specific password
    },
});

app.post("/api/send-advisory-email", async (req, res) => {
    const { to, subject, pdfBase64, fileName } = req.body;
    if (!to || !Array.isArray(to) || to.length === 0 || !subject || !pdfBase64 || !fileName) {
        return res.status(400).json({ message: "Missing or invalid required fields: to (array), subject, pdfBase64, fileName" });
    }
    try {
        const imageBuffer = fs.readFileSync("advisory_june_2025.jpg");
        const advisoryPdfBuffer = fs.readFileSync("advisory_june_2025.pdf");
        const mailOptions = {
            from: "niaz.sust@gmail.com",
            to: to.join(", "),
            subject,
            html: `
                <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
                    <h2 style="color: #2E86C1;">📢 পরামর্শ বুলেটিন – জুন ২০২৫</h2>
                    <p>প্রিয় প্রাপক,</p>
                    <p>এই ইমেইলের সাথে সংযুক্ত করা হলো <strong>জুন ২০২৫</strong> মাসের <strong>পরামর্শ বুলেটিন</strong>।</p>
                    
                    <p style="margin-top: 10px;">
                        এই বুলেটিনে অন্তর্ভুক্ত রয়েছে গুরুত্বপূর্ণ নির্দেশনা, যেমন:
                    </p>
                    <ul>
                        <li>কৃষি সম্পর্কিত উত্তম চর্চা</li>
                        <li>জলবায়ু সম্পর্কিত সতর্কতা ও প্রস্তুতি</li>
                    </ul>
        
                    <p>আশা করি এই তথ্যগুলো আপনার পরিকল্পনা ও সিদ্ধান্ত গ্রহণে সহায়ক হবে।</p>
        
                    <p style="margin-top: 20px;">
                        শুভেচ্ছান্তে,<br>
                        <strong>এগ্রোমেট ল্যাব, বিআরআরআই</strong><br>
                    </p>
        
                    <hr style="margin-top: 20px; border: none; border-top: 1px solid #ccc;" />
                    <p style="font-size: 12px; color: #777;">
                        এটি একটি স্বয়ংক্রিয় বার্তা। অনুগ্রহ করে এই ইমেইলের উত্তর প্রদান করবেন না।
                    </p>
                </div>
            `,
            attachments: [
                {
                    filename: "advisory_june_2025.pdf",
                    content: advisoryPdfBuffer,
                    contentType: "application/pdf",
                },
                {
                    filename: "advisory_june_2025.jpg",
                    content: imageBuffer,
                    contentType: "image/jpeg",
                },
            ],
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Emails sent successfully to all recipients!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send email: " + error.message });
    }
});
app.listen(PORT, () => {
  sequelize.sync()
  console.log(`Server Running on port ${PORT}`);
});
