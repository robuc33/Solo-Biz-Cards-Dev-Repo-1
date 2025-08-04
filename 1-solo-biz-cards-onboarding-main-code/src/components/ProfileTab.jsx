import {  useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

export default function ProfileTab() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleEditClick = () => setIsEditing(true);

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const createdAt = user?.metadata?.createdAt
    ? formatTimestamp(Number(user.metadata.createdAt))
    : "N/A";

  const lastUpdated = user?.lastUpdated
    ? formatTimestamp(new Date(user.lastUpdated).getTime())
    : createdAt;

  const handleCancelClick = () => {
    setName(user?.name || "");
    setPassword("");
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
      const updates = { name };
      if (password.trim() !== "") {
        updates.password = password;
      }
      await updateUser(updates);
      setIsEditing(false);
      setPassword("");
    } catch (error) {
      console.error("Failed to update name/password:", error);
    }
    setIsSaving(false);
  };

  return (
    <>
      <Header />
      <div className="p-10 bg-gray-100 min-h-screen border border-gray-200">
        <div className="max-w-2xl mx-auto">
          <div className="shadow-sm bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex items-center gap-5">
              <button
                onClick={() => window.history.back()}
                aria-label="Go back"
                className="p-2 rounded-lg hover:bg-gray-200 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 19l-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
              </button>
              <h1 className="text-gray-900 text-2xl font-bold">User Profile</h1>
            </div>
            <div className="p-6">
              <div>
                <label className="text-gray-700 font-medium text-lg mb-2 block">
                  Email Address
                </label>
                <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg border border-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span className="text-gray-700">{user?.email}</span>
                </div>
              </div>
              <div className="mt-6">
                <label className="text-gray-700 font-medium text-lg mb-2 block">
                  Name
                </label>
                <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg border border-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  {isEditing ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="text-gray-700 bg-white p-2 border border-gray-300 rounded-lg w-full"
                    />
                  ) : (
                    <span className="text-gray-700">{user?.name}</span>
                  )}
                </div>
              </div>
              <div className="mt-6">
                <label className="text-gray-700 font-medium text-lg mb-2 block">
                  Password
                </label>
                <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg border border-gray-200">
                  {isEditing ? (
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="text-gray-700 bg-white p-2 border border-gray-300 rounded-lg w-full"
                    />
                  ) : (
                    <span className="text-gray-700">********</span>
                  )}
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancelClick}
                      className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveClick}
                      className={`px-5 py-2 rounded-lg transition ${
                        isSaving
                          ? "bg-blue-300 text-white cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <div className="flex items-center gap-2">
                          <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                          Saving...
                        </div>
                      ) : (
                        "Save"
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditClick}
                    className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h2 className="text-gray-700 font-medium text-lg">
                  Account Information
                </h2>
                <p className="text-gray-500">Member since: {createdAt}</p>
                <p className="text-gray-500">Last updated: {lastUpdated}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
