const dns = require("dns");
// 1. บังคับให้ Node.js ใช้ DNS ของ Google (8.8.8.8) เพื่อเลี่ยงปัญหาเน็ตหอ/มหาลัย บล็อก SRV Record
dns.setServers(["8.8.8.8", "8.8.4.4"]);
// 2. บังคับหา IPv4 ก่อนเพื่อเลี่ยงปัญหา ECONNREFUSED จาก IPv6
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");

const userRouter = require("./routers/user.router");
const postRouter = require("./routers/post.router");

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL;
const DB_URL = process.env.DB_URL;

app.use(cors({ origin: BASE_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("<h1>Welcome to SE NPRU Blog Restful API</h1>");
});

if (!DB_URL) {
  console.error("DB_URL is missing. Please set it in your .env file");
} else {
  // 3. ใช้ Option ที่รองรับ Driver v6.7+ อย่างเต็มรูปแบบ
  mongoose
    .connect(DB_URL, {
      family: 4, // บังคับ IPv4
      serverSelectionTimeoutMS: 5000, // ถ้าเชื่อมไม่ได้ให้ฟ้องใน 5 วินาที ไม่ต้องรอนาน
    })
    .then(() => {
      console.log("✅ MongoDB connected successfully (v6.7 mode)");
    })
    .catch((error) => {
      console.error("❌ MongoDB connection error:", error.message);
      console.log("------------------------------------------");
      console.log("ถ้ายังไม่ได้: ให้ลอง 'ปิด Wi-Fi มหาลัย' แล้วใช้ 'Hotspot มือถือ' รันดูครับ");
    });
}

// Use Router
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);

app.listen(PORT, () => {
  console.log("🚀 Server is running on http://localhost:" + PORT);
});