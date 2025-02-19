import React, { useEffect, useState } from "react";
import { getProfile } from "../services/api";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getProfile()
      .then(data => setProfile(data))
      .catch(err => setError(err.error || "Error fetching profile"));
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="card mx-auto" style={{ maxWidth: "500px" }}>
      <div className="card-body">
        <h3 className="card-title">Profile</h3>
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role}</p>
      </div>
    </div>
  );
};

export default Profile;
