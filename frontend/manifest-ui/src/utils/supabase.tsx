import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hkostdobmbhnhiqeomrn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrb3N0ZG9ibWJobmhpcWVvbXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4Njk5MTEsImV4cCI6MjA1NDQ0NTkxMX0.UD2gDP53EyNVESDOtbhlP98DKTWNFsTSVEUmiO-QxWc";
const supabase = createClient(supabaseUrl, supabaseKey);

const SupabaseTest: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        console.error("Error fetching users:", error.message);
      } else {
        setUsers(data);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Supabase Test</h2>
      {loading ? <p>Loading...</p> : null}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.first_name} {user.last_name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupabaseTest;
