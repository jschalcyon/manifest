import React, { useEffect, useState } from "react";
import axios from "axios";
import RGL, { WidthProvider } from "react-grid-layout";
import "./dashboard.css"; // Import the CSS file

const ReactGridLayout = WidthProvider(RGL);

// Function to get user UUID (Replace this with real authentication logic)
const getUserUUID = () => {
  return localStorage.getItem("userUUID") || "default-uuid";
};

// Default layout to prevent empty grid
const defaultLayout = [
  { i: "1", x: 0, y: 0, w: 2, h: 3 },
  { i: "2", x: 2, y: 0, w: 2, h: 3 },
  { i: "3", x: 4, y: 0, w: 2, h: 3 },
  { i: "4", x: 6, y: 0, w: 2, h: 3 },
  { i: "5", x: 8, y: 0, w: 2, h: 3 }
];

const Dashboard: React.FC = () => {
  const [layout, setLayout] = useState(defaultLayout);
  const userUUID = getUserUUID();

  // Fetch user's grid layout from backend
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/grid-layout/${userUUID}`)
      .then((response) => {
        if (response.data && response.data.layout.length > 0) {
          setLayout(response.data.layout);
        }
      })
      .catch((error) => console.error("Error fetching layout:", error));
  }, [userUUID]);

  // Save layout changes to backend
  const onLayoutChange = (newLayout: any) => {
    setLayout(newLayout);
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/grid-layout/${userUUID}`, { layout: newLayout })
      .catch((error) => console.error("Error saving layout:", error));
  };

  // Reset layout for user
  const resetLayout = () => {
    setLayout(defaultLayout);
    axios
      .delete(`${process.env.REACT_APP_API_URL}/api/grid-layout/${userUUID}`)
      .catch((error) => console.error("Error resetting layout:", error));
  };

  return (
    <div className="dashboard-container">
      <button onClick={resetLayout}>Reset Layout</button>
      <ReactGridLayout
        className="layout"
        cols={12}
        rowHeight={50} // Increased row height for better visibility
        layout={layout}
        onLayoutChange={onLayoutChange}
      >
        {layout.map((item) => (
          <div key={item.i} data-grid={item} className="grid-item">
            <span>{item.i}</span>
          </div>
        ))}
      </ReactGridLayout>
    </div>
  );
};

export default Dashboard;
