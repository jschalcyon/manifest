import React, { useState, useEffect } from "react";

const NodeTest: React.FC = () => {
  const [message, setMessage] = useState<string>("Loading...");

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/test");
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        setMessage("Error connecting to Node server.");
        console.error("Error:", error);
      }
    };

    fetchTest();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Node.js Server Test</h2>
      <p>Server Response: {message}</p>
    </div>
  );
};

export default NodeTest;