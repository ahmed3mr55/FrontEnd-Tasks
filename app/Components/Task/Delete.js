"use client";
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useTasks } from '../contexts/TaskContext';

const Delete = ({ task, onClose }) => {
  const { deleteTaskContext } = useTasks();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/task/${task._id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        deleteTaskContext(task._id);
        onClose();
      } else {
        setError(data.message || 'Failed to delete task');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg">
        <h2 className="mb-4 text-xl font-bold text-center text-red-600">
          Delete Task
        </h2>
        <p className="mb-4 text-center">Are you sure you want to delete this task?</p>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="flex justify-center gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 text-white cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 text-white cursor-pointer"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Delete;