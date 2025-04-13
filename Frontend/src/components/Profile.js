import React, { useEffect, useState } from "react";
import { getProfile } from "../services/api";
import "C:\\Users\\aryan\\OneDrive\\Desktop\\Dotnet_Final_Social_Project\\App\\social-media-frontend\\src\\Styles\\Profile.css"; // New CSS file for profile page

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getProfile()
      .then((data) => setProfile(data))
      .catch((err) => setError(err.error || "Error fetching profile"));
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img src="/default-avatar.png" alt="User" className="profile-img" />
        <h3>{profile.username}</h3>
        <p>{profile.email}</p>
        <span className="role">{profile.role}</span>
      </div>
    </div>
  );
};

export default Profile;
