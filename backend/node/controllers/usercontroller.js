const supabase = require("../supabase"); // Ensure Supabase connection
const path = require("path");
const fs = require("fs");

// ✅ Fetch all users
exports.getUsers = async (req, res) => {
  try {
    console.log("✅ Fetching users from Supabase...");
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
      console.error("❌ Supabase Error:", error);
      return res.status(500).json({ error: "Failed to fetch users" });
    }

    res.json(data);
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Create a new user
exports.createUser = async (req, res) => {
  const { full_name, email, phone_number, role, profile_pic_url, password } = req.body;

  try {
    const { data: user, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name, phone_number, role, profile_pic_url },
      email_confirm: true,
    });

    if (error) throw error;

    const { error: dbError } = await supabase.from("users").insert([
      { id: user.id, full_name, email, phone_number, role, profile_pic_url, created_at: new Date() },
    ]);

    if (dbError) throw dbError;

    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    console.error("❌ Error creating user:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// ✅ Update user details
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const { error } = await supabase.from("users").update(updates).eq("id", id);
    if (error) throw error;

    res.json({ message: "User updated successfully!" });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// ✅ Reset password
exports.resetPassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("email")
      .eq("id", id)
      .single();

    if (fetchError || !user) {
      return res.status(404).json({ error: "User not found." });
    }

    const { error: authError } = await supabase.auth.admin.updateUserById(id, { password });
    if (authError) throw authError;

    res.json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("❌ Error resetting password:", error);
    res.status(500).json({ error: "Failed to reset password." });
  }
};

// ✅ Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) throw error;

    res.json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user." });
  }
};

// ✅ Upload profile picture (Fixed & Improved)
exports.uploadProfilePic = async (req, res) => {
  try {
    const userId = req.params.id;

    // ✅ Ensure a file was uploaded
    if (!req.file) {
      console.error("❌ No file received.");
      return res.status(400).json({ error: "No file uploaded." });
    }

    console.log(`📂 Upload request received for user: ${userId}`);
    console.log(`📝 Received file: ${req.file.originalname}`);

    // ✅ Ensure user directory exists
    const userPath = path.join(__dirname, "../data/users", userId);
    if (!fs.existsSync(userPath)) {
      console.log("📂 Creating directory:", userPath);
      fs.mkdirSync(userPath, { recursive: true });
    }

    // ✅ Construct file path
    const filePath = `/static/users/${userId}/${req.file.filename}`;
    console.log("✅ File stored at:", filePath);

    // ✅ Save file path to Supabase
    const { error } = await supabase
      .from("users")
      .update({ profile_pic_url: filePath })
      .eq("id", userId);

    if (error) {
      console.error("❌ Supabase error:", error);
      throw error;
    }

    console.log("✅ Upload successful!");
    res.json({ url: `http://localhost:5000${filePath}` });

  } catch (error) {
    console.error("❌ Error uploading profile picture:", error);
    res.status(500).json({ error: "Failed to upload profile picture" });
  }
};
