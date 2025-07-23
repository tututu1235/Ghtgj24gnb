const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Root test
app.get("/", (req, res) => {
  res.send("✅ Saim API is running!");
});

// Caption API
app.get("/api/caption", (req, res) => {
  const { category, language = "bn" } = req.query;

  if (!category) return res.status(400).json({ error: "Category is required" });

  const filePath = path.join(__dirname, "captions", `${category}.json`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "Caption category not found" });

  const captions = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const random = captions[Math.floor(Math.random() * captions.length)];

  if (!random || !random[language]) return res.status(404).json({ error: "Caption not available in this language" });

  return res.json({ category, caption: random[language] });
});

// Font API
app.post("/api/font", (req, res) => {
  const { number, text } = req.body;

  if (!number || !text) return res.status(400).json({ error: "Missing number or text" });

  const filePath = path.join(__dirname, "fonts", `${number}.json`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "Font number not found" });

  const fontMap = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const converted = text.split("").map(char => fontMap[char] || char).join("");

  return res.json({ converted });
});

// List available captions
app.get("/api/caption/list", (req, res) => {
  const dir = path.join(__dirname, "captions");
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".json")).map(f => f.replace(".json", ""));
  return res.json({ categories: files });
});

// List available fonts
app.get("/api/font/list", (req, res) => {
  const dir = path.join(__dirname, "fonts");
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".json")).map(f => f.replace(".json", ""));
  return res.json({ fonts: files });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`✅ Saim API server running on port ${PORT}`);
});
