const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const usersDataPath = path.join(__dirname, "../data/users/");

// Ensure the user directory exists
const ensureUserDirectory = (uuid) => {
  const userDir = path.join(usersDataPath, uuid);
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
  return path.join(userDir, "grid-layout.json");
};

// Get grid layout for a specific user
router.get("/grid-layout/:uuid", (req, res) => {
  const userFilePath = ensureUserDirectory(req.params.uuid);

  fs.readFile(userFilePath, "utf8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        return res.json({ layout: [] }); // Return empty layout if file doesn't exist
      }
      console.error("Error reading layout file:", err);
      return res.status(500).json({ error: "Failed to load layout" });
    }
    res.json(JSON.parse(data));
  });
});

// Save grid layout for a specific user
router.post("/grid-layout/:uuid", (req, res) => {
  const { layout } = req.body;
  const userFilePath = ensureUserDirectory(req.params.uuid);

  fs.writeFile(userFilePath, JSON.stringify({ layout }, null, 2), (err) => {
    if (err) {
      console.error("Error saving layout file:", err);
      return res.status(500).json({ error: "Failed to save layout" });
    }
    res.status(200).json({ message: "Layout saved" });
  });
});

// Reset grid layout for a specific user
router.delete("/grid-layout/:uuid", (req, res) => {
  const userFilePath = ensureUserDirectory(req.params.uuid);

  fs.writeFile(userFilePath, JSON.stringify({ layout: [] }, null, 2), (err) => {
    if (err) {
      console.error("Error resetting layout file:", err);
      return res.status(500).json({ error: "Failed to reset layout" });
    }
    res.status(200).json({ message: "Layout reset" });
  });
});

module.exports = router;