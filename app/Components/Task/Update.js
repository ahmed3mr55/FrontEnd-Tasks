"use client";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { useTasks } from "../contexts/TaskContext";

const Update = ({ task, onClose }) => {
  const { updateTaskContext } = useTasks();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.body);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const maxDescriptionLength = 100;
  const remaining = maxDescriptionLength - description.length;

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/task/${task._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify({ title, body: description }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        updateTaskContext(data.task);
        onClose();
      } else {
        setError(data.message || "Failed to update task");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg">
        <h2 className="mb-4 text-xl font-bold text-center text-blue-600">
          Edit Task
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor="title" className="block mb-1 font-medium">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="description" className="block mb-1 font-medium">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
              maxLength={maxDescriptionLength}
            />
            <p className={`mt-1 text-sm ${remaining === 0 ? "text-red-500" : "text-gray-500"}`}>
              {remaining} characters remaining
            </p>
          </div>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 bg-gray-500 rounded cursor-pointer text-white hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 rounded text-white cursor-pointer hover:bg-blue-700 transition-colors"
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
