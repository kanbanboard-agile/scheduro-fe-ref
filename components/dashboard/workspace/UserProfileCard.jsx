"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ToDoListCard } from "./ToDoList";
import { updateUser } from "@/lib/api/user";

export function UserProfileCard({ isLoading, user, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: null,
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      avatar: null,
    });
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setFormData((prev) => ({ ...prev, avatar: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setUpdateError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError(null);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      if (formData.avatar) {
        payload.append("avatar", formData.avatar);
      }

      const response = await updateUser(user.id, payload);
      if (!response.success) {
        throw new Error(response.message || "Failed to update profile");
      }

      setIsEditing(false);
      setIsOpen(false);

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      setUpdateError(error.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Mobile profile modal
  const MobileProfileModal = () => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100/80 bg-opacity-50 z-50 p-4">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-md h-auto">
          {isLoading ? (
            <>
              <div className="text-center border-b pb-4">
                <Skeleton className="w-14 h-14 mx-auto rounded-full" />
                <Skeleton className="h-5 w-24 mt-2 mx-auto" />
                <Skeleton className="h-4 w-32 mt-1 mx-auto" />
              </div>
              <div className="mt-4">
                <Skeleton className="h-6 w-32 mx-auto mb-4" />
                <ul className="mt-2 space-y-2">
                  {Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <li
                        key={index}
                        className="flex items-center p-2 bg-gray-100 rounded-md shadow space-x-3"
                      >
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div className="flex flex-col space-y-2">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </>
          ) : isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="text-center border-b pb-4 relative">
                <button
                  type="button"
                  className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  ✖
                </button>
                <h2 className="text-lg font-medium mb-4">Edit Profile</h2>
              </div>
              <div className="mb-4">
                <label className="block text-left mb-1 font-medium" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-left mb-1 font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-left mb-1 font-medium" htmlFor="avatar">
                  Avatar
                </label>
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              {updateError && (
                <p className="text-red-600 mb-4 text-left">{updateError}</p>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="px-4 py-2 border rounded"
                  disabled={updateLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  disabled={updateLoading}
                >
                  {updateLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="text-center border-b pb-4 relative">
                <button
                  className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  ✖
                </button>
                <img
                  src="https://res.cloudinary.com/dy8fe8tbe/image/upload/v1742238102/user_profile_grka1i.svg"
                  className="w-14 h-14 mx-auto"
                  alt="User Profile"
                />
                <p className="text-l font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <button
                  onClick={handleEditClick}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Edit Profile
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Card className="p-4 rounded-lg text-center border border-[#6387CE]">
        {isLoading ? (
          <>
            <Skeleton className="w-14 h-14 mx-auto rounded-full" />
            <Skeleton className="h-5 w-24 mt-2 mx-auto" />
            <Skeleton className="h-4 w-32 mt-1 mx-auto" />
          </>
        ) : (
          <>
            <img
              src="https://res.cloudinary.com/dy8fe8tbe/image/upload/v1742238102/user_profile_grka1i.svg"
              className="w-14 h-14 mx-auto"
              alt="User Profile"
              onClick={() => setIsOpen(true)}
              role="button"
              aria-label="Open profile"
              tabIndex={0}
            />
            <p className="text-l font-medium mt-2">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </>
        )}
      </Card>
      <MobileProfileModal />
    </>
  );
}
