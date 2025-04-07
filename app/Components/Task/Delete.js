"use client";
import React, { useState } from "react";
import Cookies from "js-cookie";

const Delete = ({ onClose, task }) => {
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState("");

  const deleteTask = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/task/${task._id}`,{
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      })
      const data = await res.json();
      if (res.ok) {
        setDone("Task is deleted successfully");
        onClose();
      }else {
        setError(data.message || "Failed to delete task");
      }
    } catch (error) {
      setError(error.message || "An error occurred");
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-center text-red-600">
          Delete Task
        </h2>
        <p className="mb-6 text-center text-gray-700">
          Are you sure you want to delete this task?
        </p>

        {/* عرض رسالة الخطأ أو النجاح */}
        {error && (
          <p className="mb-4 text-center text-sm text-red-500">{error}</p>
        )}
        {done && (
          <p className="mb-4 text-center text-sm text-green-500">{done}</p>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            type="button"
            className="px-4 cursor-pointer py-2 font-semibold text-white bg-gray-400 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 cursor-pointer font-semibold text-white bg-red-600 rounded hover:bg-red-700"
            disabled={loading}
            onClick={deleteTask}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Delete;
