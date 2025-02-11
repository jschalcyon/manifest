import React, { useState, useEffect } from "react";
import Navbar from "../../components/navigation/menu.tsx"; // Import Navbar
import EditUser from "./edituser.tsx"; // Import EditUser modal
import CreateUser from "./createuser.tsx"; // Import CreateUser modal
import "./users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editUserModal, setEditUserModal] = useState(false);
  const [createUserModal, setCreateUserModal] = useState(false); // For Create User modal
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) => {
        if (!user || (!user.full_name && !user.email)) return false;

        const searchLower = searchQuery.toLowerCase();
        const fullName = user.full_name
          ? user.full_name.toLowerCase()
          : `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();

        return (
          fullName.includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
        );
      })
    );
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();

      console.log("Fetched Users:", data);

      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditUserModal(true);
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      fetchUsers();
    } catch (error) {
      console.error("❌ Error deleting user:", error);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="users-container">
        <h2>User Management</h2>

        {/* Create User and Search */}
        <div className="search-container">
          <button
            className="create-user-button"
            onClick={() => setCreateUserModal(true)}
          >
            + Create User
          </button>
          <input
            type="text"
            className="search-box"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Users Table */}
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      {user.profile_pic_url ? (
                        <img
                          src={user.profile_pic_url}
                          alt="Profile"
                          className="profile-pic"
                        />
                      ) : (
                        <span className="no-pic">N/A</span>
                      )}
                    </td>
                    <td>
                      {user.full_name ||
                        `${user.first_name || ""} ${user.last_name || ""}`}
                    </td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.status || "Active"}</td>
                    <td className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => handleEditUser(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-users">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editUserModal && (
        <EditUser
          user={selectedUser}
          onClose={() => setEditUserModal(false)}
          onUserUpdated={fetchUsers}
        />
      )}

      {/* Create User Modal */}
      {createUserModal && (
        <CreateUser
          onClose={() => setCreateUserModal(false)}
          onUserCreated={fetchUsers}
        />
      )}
    </div>
  );
};

export default Users;
