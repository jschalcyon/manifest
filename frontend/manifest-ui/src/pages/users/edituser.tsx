import React, { useState } from "react";
import "./edituser.css";
import { Phone, Email, Key, Close } from "@mui/icons-material";

const EditUser = ({ user, onClose, onUserUpdated }) => {
  const [formData, setFormData] = useState(user);
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Validate password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    setPasswordValid(passwordRegex.test(newPassword));
  };

  const handleProfilePicUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.error("❌ No file selected.");
      return;
    }
  
    const formDataObj = new FormData();
    formDataObj.append("file", file);
  
    console.log("📤 Uploading file:", file.name);
  
    try {
      const response = await fetch(`http://localhost:5000/api/users/upload/${formData.id}`, {
        method: "POST",
        body: formDataObj,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }
  
      const data = await response.json();
      console.log("✅ Upload successful:", data);
  
      // ✅ Update the user profile picture immediately
      setFormData((prevData) => ({
        ...prevData,
        profile_pic_url: data.url,
      }));
  
    } catch (error) {
      console.error("❌ Error uploading profile picture:", error);
    }
  }; 

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${formData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      if (passwordValid && password) {
        // Send password reset request
        const passwordResponse = await fetch(
          `http://localhost:5000/api/users/reset-password/${formData.id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
          }
        );

        if (!passwordResponse.ok) {
          throw new Error("Failed to reset password");
        }
      }

      onUserUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const passwordValidationMessage = passwordValid
    ? "Password meets all requirements."
    : "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.";

  return (
    <div className="edit-user-modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="close-button" onClick={onClose}>
          <Close />
        </button>

        <div className="header">
          <label htmlFor="profile-pic-upload" className="profile-pic-label">
            <img
              src={
                formData.profile_pic_url ||
                "http://localhost:5000/static/users/blankprofile.png"
              }
              alt="Profile"
              className="profile-pic"
            />
          </label>
          <input
            type="file"
            id="profile-pic-upload"
            className="hidden-file-input"
            onChange={handleProfilePicUpload}
          />

          {/* Editable Full Name */}
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            className="full-name-input"
            value={formData.full_name || ""}
            onChange={handleChange}
          />

          <p>{formData.role || "Role"}</p>
        </div>

        <div className="form-body">
          <div className="form-group">
            <Phone className="icon" />
            <input
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              value={formData.phone_number || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <Email className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email || ""}
              onChange={handleChange}
            />
          </div>

          {/* Role Field */}
          <div className="form-group role-group">
            <label htmlFor="role">Role:</label>
            <select
              name="role"
              id="role"
              value={formData.role || ""}
              onChange={handleChange}
            >
              <option value="Admin">Admin</option>
              <option value="Viewer">Viewer</option>
              <option value="Customer">Customer</option>
              <option value="Support">Support</option>
              <option value="Sales">Sales</option>
            </select>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <Key className="icon" />
            <input
              type="password"
              name="password"
              placeholder="Set Password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <p
            className={`password-validation ${
              passwordValid ? "valid" : "invalid"
            }`}
          >
            {passwordValidationMessage}
          </p>
        </div>

        {/* Save Button */}
        <button className="save-button" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditUser;