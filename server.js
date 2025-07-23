const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

// 🔍 Root endpoint
app.get("/", (req, res) => {
  res.send("✅ Saim API is running!");
});

// 🌐 GitHub Base URL
const FONT_BASE = "https://raw.githubusercontent.com/tututu1235/Ghtgj24gnb/main/fonts";
const CAPTION_BASE = "https://raw.githubusercontent.com/tututu1235/Ghtgj24gnb/main/captions";

// 🔠 Font List Route
app.get("/api/font/list", async (req, res) => {
  try {
    const response = await axios.get(`${FONT_BASE}/list.json`);
    res.json(response.data);
  } catch (error) {
    console.error("❌ Font List Error:", error.message);
    res.status(500).json({ error: "Font list not found." });
  }
});

// 🔤 Font Convert Route
app.post("/api/font", async (req, res) => {
  const { number, text } = req.body;

  if (!number || !text) {
    return res.status(400).json({ error: "Missing number or text." });
  }

  try {
    const response = await axios.get(`${FONT_BASE}/${number}.json`);
    const fontMap = response.data;

    const converted = text
      .split("")
      .map((char) => fontMap[char] || char)
      .join("");

    res.json({ converted });
  } catch (error) {
    console.error("❌ Font Convert Error:", error.message);
    res.status(500).json({ error: "Font not found or error processing." });
  }
});

// 📜 Caption Route
app.get("/api/caption", async (req, res) => {
  const { category, language = "bn" } = req.query;

  if (!category) {
    return res.status(400).json({ error: "Missing caption category." });
  }

  try {
    const response = await axios.get(`${CAPTION_BASE}/${category}.json`);
    const captions = response.data;

    if (!Array.isArray(captions) || captions.length === 0) {
      return res.status(404).json({ error: "No captions found." });
    }

    const random = captions[Math.floor(Math.random() * captions.length)];
    const captionText = language === "en" ? random.en : random.bn;

    res.json({ category, caption: captionText });
  } catch (error) {
    console.error("❌ Caption Error:", error.message);
    res.status(500).json({ error: "Caption not found or error occurred." });
  }
});

// 🚀 Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Saim API running on port ${PORT}`);
});
