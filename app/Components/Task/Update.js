"use client";
import React, { useState } from "react";
import Cookies from "js-cookie";

const Update = ({ onClose, task }) => {
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.body || "");
  const [done, setDone] = useState("");

  const update = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/task/${task._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, body: description }),
        }
      );
      const data = await req.json();
      if (req.ok) {
        setDone("Task is updated successfully");
        onClose();
      } else {
        setError(data.message || "Failed to update task");
      }
    } catch (error) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-center text-blue-600">
          Edit Task
        </h2>
        {error && (
          <p className="mb-4 text-center text-sm text-red-500">{error}</p>
        )}
        {done && (
          <p className="mb-4 text-center text-sm text-green-500">{done}</p>
        )}
        <form onSubmit={update} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 cursor-pointer text-white bg-gray-500 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2  cursor-pointer text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              {loading ? "Updating..." : "Apply"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Update;
