import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SettingsOutlined, AccountCircleOutlined } from "@mui/icons-material";
import "./menu.css";

const Navbar: React.FC = () => {
  const [isUserDropdownVisible, setIsUserDropdownVisible] = useState(false);

  const toggleUserDropdown = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsUserDropdownVisible((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsUserDropdownVisible(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const dropdown = document.querySelector(".user-dropdown");
      const userIcon = document.querySelector(".user-icon");

      if (
        dropdown &&
        !dropdown.contains(event.target as Node) &&
        !userIcon?.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <nav className="top-nav">
      <div className="brand-title">Manifest</div>

      {/* Middle: Menu */}
      <div className="menu">
        <Link to="/">Home</Link>
        <div className="divider"></div>
        <Link to="/sales">Sales</Link>
        <div className="divider"></div>
        <Link to="/manufacturing">Manufacturing</Link>
        <div className="divider"></div>
        <Link to="/projects">Projects</Link>
        <div className="divider"></div>
        <Link to="/support">Support</Link>
      </div>

      {/* Right: Search Bar and Icons */}
      <div className="right-actions">
        <input type="text" className="static-search-field" placeholder="Search..." />
        <div className="divider"></div>

        {/* Settings Icon (Gear) */}
        <SettingsOutlined className="icon" />

        {/* User Icon */}
        <AccountCircleOutlined className="icon user-icon" onClick={toggleUserDropdown} />

        {/* Dropdown Menu */}
        {isUserDropdownVisible && (
          <div className="user-dropdown">
            <Link to="/customers">Customers</Link>
            <Link to="/vendors">Vendors</Link>
            <Link to="/users">Users</Link>
            <hr />
            <Link to="/logout">Log Off</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;