const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  getUsers,
  updateUser,
  deleteUser,
  resetPassword,
  uploadProfilePic,
  createUser,
} = require("../controllers/usercontroller");

// ✅ Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.params.id;
    const userPath = path.join(__dirname, "../data/users", userId);

    // ✅ Ensure the directory exists
    fs.mkdirSync(userPath, { recursive: true });
    cb(null, userPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ✅ Define Routes
router.get("/", getUsers);
router.post("/create", createUser);
router.put("/:id", updateUser);
router.post("/reset-password/:id", resetPassword);
router.delete("/:id", deleteUser);

// ✅ Apply `multer` to the file upload route
router.post("/upload/:id", upload.single("file"), uploadProfilePic);

module.exports = router;