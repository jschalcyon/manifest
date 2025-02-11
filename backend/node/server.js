const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load .env file

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Debugging middleware
app.use((req, res, next) => {
  console.log(`🛠 Received request: ${req.method} ${req.url}`);
  next();
});

// ✅ Serve static profile pictures
app.use("/static/users", express.static("data/users"));


// ✅ Routes
app.use("/api/users", require("./routes/users"));

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});