import { useUser } from "../context/UserProvider";
import { useEffect, useState, useRef } from "react";

function getInitials(email, firstName, lastName) {
  const fallback = email?.[0] || "U";
  const f = firstName?.[0] || "";
  const l = lastName?.[0] || "";
  return (f + l || fallback).toUpperCase();
}

export default function Profile() {
  const { user, logout } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState({});
  const fileInputRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || "";

  async function fetchProfile() {
    try {
      const result = await fetch(`${API_URL}/api/user/profile`, {
        credentials: "include",
      });

      if (result.status === 401) {
        await logout();
        return;
      }

      const payload = await result.json();
      setData(payload?.user ?? payload ?? {});
    } catch {
      setIsError(true);
      setStatusMessage("Unable to load profile.");
    } finally {
      setIsLoading(false);
    }
  }

  async function onUpdateImage() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setIsError(true);
      setStatusMessage("Please select an image first.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setIsError(true);
      setStatusMessage("Only image files are allowed.");
      return;
    }

    setIsUploading(true);
    setIsError(false);
    setStatusMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/api/user/profile/image`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.status === 401) {
        await logout();
        return;
      }

      if (!response.ok) {
        setIsError(true);
        setStatusMessage("Failed to update image.");
        return;
      }

      setIsError(false);
      setStatusMessage("Profile image updated successfully.");
      await fetchProfile();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      setIsError(true);
      setStatusMessage("Error uploading image.");
    } finally {
      setIsUploading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading profile...</div>;
  }

  const hasImage = Boolean(data?.profileImage);
  const displayEmail = data?.email || user?.email || "-";
  const initials = getInitials(displayEmail, data?.firstname, data?.lastname);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Profile</h1>
          <p className="muted">Manage your personal information and photo.</p>
        </div>
      </div>

      <div className="card profile-shell">
        <div className="profile-hero">
          {hasImage ? (
            <img
              src={`${API_URL}${data.profileImage}`}
              alt="Profile"
              className="profile-avatar"
            />
          ) : (
            <div className="profile-avatar profile-avatar-fallback">{initials}</div>
          )}

          <div>
            <h2 className="profile-name">
              {data?.firstname || "Unknown"} {data?.lastname || "User"}
            </h2>
            <p className="muted">{displayEmail}</p>
          </div>
        </div>

        <div className="profile-grid">
          <div className="profile-item">
            <div className="profile-label">ID</div>
            <div className="mono">{data?._id || "-"}</div>
          </div>
          <div className="profile-item">
            <div className="profile-label">First Name</div>
            <div>{data?.firstname || "-"}</div>
          </div>
          <div className="profile-item">
            <div className="profile-label">Last Name</div>
            <div>{data?.lastname || "-"}</div>
          </div>
          <div className="profile-item">
            <div className="profile-label">Email</div>
            <div>{displayEmail}</div>
          </div>
        </div>

        <div className="profile-upload">
          <label htmlFor="profileImage" className="profile-label">
            Profile Image
          </label>
          <div className="profile-upload-row">
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              ref={fileInputRef}
              accept="image/*"
            />
            <button type="button" onClick={onUpdateImage} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Update Image"}
            </button>
          </div>
          {statusMessage ? (
            <p className={isError ? "error-text" : "status-text"}>{statusMessage}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
