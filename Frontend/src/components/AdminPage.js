import React, { useEffect, useState } from "react";
import { getAdminData } from "../services/api";

const AdminPage = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const data = await getAdminData();
        setMessage(data.message);
      } catch (err) {
        setMessage(err.error || "Failed to load admin data.");
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div>
      <h2>Admin Page</h2>
      <p>{message}</p>
    </div>
  );
};

export default AdminPage;
