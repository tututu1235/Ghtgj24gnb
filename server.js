const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Saim API is running!");
});

// 🔠 Font List Route (GET)
app.get("/api/font/list", async (req, res) => {
  try {
    const url = "https://raw.githubusercontent.com/tututu1235/Ghtgj24gnb/main/fonts/list.json";
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Font list not found." });
  }
});

// 🔤 Font Convert Route (POST)
app.post("/api/font", async (req, res) => {
  const { number, text } = req.body;

  if (!number || !text) {
    return res.status(400).json({ error: "Missing number or text." });
  }

  try {
    const fontUrl = `https://raw.githubusercontent.com/tututu1235/Ghtgj24gnb/main/fonts/${number}.json`;
    const response = await axios.get(fontUrl);
    const fontMap = response.data;

    const converted = text
      .split("")
      .map(char => fontMap[char] || char)
      .join("");

    res.json({ converted });
  } catch (error) {
    res.status(500).json({ error: "Font not found or error processing." });
  }
});

// 📜 Caption Route (GET)
app.get("/api/caption", async (req, res) => {
  const { category, language = "bn" } = req.query;

  if (!category) {
    return res.status(400).json({ error: "Missing caption category." });
  }

  try {
    const captionUrl = `https://raw.githubusercontent.com/tututu1235/Ghtgj24gnb/main/captions/${category}.json`;
    const response = await axios.get(captionUrl);
    const captions = response.data;

    if (!Array.isArray(captions) || captions.length === 0) {
      return res.status(404).json({ error: "No captions found." });
    }

    const random = captions[Math.floor(Math.random() * captions.length)];
    res.json({ category, caption: language === "en" ? random.en : random.bn });
  } catch (error) {
    res.status(500).json({ error: "Caption not found or error occurred." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Saim API running on port ${PORT}`);
});
