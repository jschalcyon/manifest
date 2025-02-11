import React, { useState } from "react";
import "./createuser.css";

const CreateUser = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
    profilePicUrl: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <div className="modal-header">
          <span>Create User</span>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="profile-placeholder"></div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="role"
            placeholder="Role"
            value={formData.role}
            onChange={handleChange}
          />
          <input
            type="text"
            name="profilePicUrl"
            placeholder="Profile Picture URL"
            value={formData.profilePicUrl}
            onChange={handleChange}
          />
          <div className="modal-buttons">
            <button type="submit" className="create-button">
              Create
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
