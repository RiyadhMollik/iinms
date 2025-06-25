import fs from "fs";
import nodemailer from "nodemailer";
import axios from "axios";
import * as cheerio from "cheerio";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";



export const Scraping = async (req, res) => {
  const loginUrl = "http://123.0.31.250/iconiptsp/";
  const dataUrl = "http://123.0.31.250/iconiptsp/pin/LastCallDisplay.jsp";

  const jar = new CookieJar();
  const client = wrapper(axios.create({ jar }));

  try {
    // Step 1: Login
    await client.post(
      loginUrl,
      new URLSearchParams({
        inpUserName: "09644300300",
        inpPassword: "PHxsnDeh6E",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    // Step 2: Fetch the data page
    const { data: html } = await client.get(dataUrl);

    // Step 3: Parse with Cheerio
    const $ = cheerio.load(html);
    const table = [];

    $("table tr").each((i, row) => {
      const cells = $(row)
        .find("td")
        .map((i, td) => $(td).text().trim())
        .get();
      if (cells.length > 0) {
        table.push(cells);
      }
    });

    return table;
  } catch (err) {
    console.error("Scraping error:", err.message);
    return null;
  }
}



const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "niaz.sust@gmail.com", // Replace with your Gmail
        pass: "yibw sjul qonb bnap",  // Replace with your App Password
    },
});




export const sendAdvisoryEmail = async (req, res) => {
    const { to, subject } = req.body;

    if (!to || !Array.isArray(to) || to.length === 0 || !subject) {
        return res.status(400).json({
            message: "Missing or invalid required fields: to (array), subject, pdfBase64, fileName",
        });
    }

    try {
        const imageBuffer = fs.readFileSync("/var/www/iinms/controllers/advisory_june_2025.jpg");
        const advisoryPdfBuffer = fs.readFileSync("/var/www/iinms/controllers/advisory_june_2025.pdf");

        const mailOptions = {
            from: "niaz.sust@gmail.com",
            to: to.join(", "),
            subject,
            html: `
                <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
                    <h2 style="color: #2E86C1;">📢 পরামর্শ বুলেটিন – জুন ২০২৫</h2>
                    <p>প্রিয় প্রাপক,</p>
                    <p>এই ইমেইলের সাথে সংযুক্ত করা হলো <strong>জুন ২০২৫</strong> মাসের <strong>পরামর্শ বুলেটিন</strong>।</p>
                    <p style="margin-top: 10px;">এই বুলেটিনে অন্তর্ভুক্ত রয়েছে গুরুত্বপূর্ণ নির্দেশনা, যেমন:</p>
                    <ul>
                        <li>কৃষি সম্পর্কিত উত্তম চর্চা</li>
                        <li>জলবায়ু সম্পর্কিত সতর্কতা ও প্রস্তুতি</li>
                    </ul>
                    <p>আশা করি এই তথ্যগুলো আপনার পরিকল্পনা ও সিদ্ধান্ত গ্রহণে সহায়ক হবে।</p>
                    <p style="margin-top: 20px;">শুভেচ্ছান্তে,<br><strong>এগ্রোমেট ল্যাব, বিআরআরআই</strong><br></p>
                    <hr style="margin-top: 20px; border: none; border-top: 1px solid #ccc;" />
                    <p style="font-size: 12px; color: #777;">এটি একটি স্বয়ংক্রিয় বার্তা। অনুগ্রহ করে এই ইমেইলের উত্তর প্রদান করবেন না।</p>
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
};
