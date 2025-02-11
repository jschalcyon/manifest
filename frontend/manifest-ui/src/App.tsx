import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/dashboard.tsx";
import Users from "./pages/users/users.tsx";
import NodeTest from "./utils/node.tsx";
import SupabaseTest from "./utils/supabase.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/utils/node" element={<NodeTest />} />
        <Route path="/utils/supabase" element={<SupabaseTest />} />
      </Routes>
    </Router>
  );
};

export default App;
