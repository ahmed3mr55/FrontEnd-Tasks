"use client";
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useTasks } from '../contexts/TaskContext';

const AddTask = ({ onClose }) => {
  const { addTaskContext } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const maxDescriptionLength = 100;
  const remaining = maxDescriptionLength - description.length;
  const isValid = title.trim() && description.trim();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!isValid) return setError('Title and Description are required');
    const token = Cookies.get('token');
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/task/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, body: description }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        addTaskContext(data.task);
        onClose();
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md bg-white p-6 rounded-lg">
        <h2 className="mb-4 text-2xl font-bold text-center text-blue-600">
          Create Task
        </h2>
        {error && (
          <p className="text-red-500 mb-2 text-center">{error}</p>
        )}
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label htmlFor="title" className="block mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-2 py-1 rounded"
              maxLength={50}
            />
          </div>
          <div>
            <label htmlFor="description" className="block mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border px-2 py-1 rounded"
              maxLength={maxDescriptionLength}
            />
            <p
              className={`mt-1 text-sm ${
                remaining === 0 ? 'text-red-500' : 'text-gray-600'
              }`}
            >
              {remaining} characters remaining
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 cursor-pointer bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
