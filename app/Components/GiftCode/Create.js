"use client";
import React, { useState } from "react";
import Cookies from "js-cookie";

const CreateCode = () => {
  const token = Cookies.get("token");
  const [type, setType] = useState("tasks");
  const [amount, setAmount] = useState(0);
  const [usageLimit, setUsageLimit] = useState(1);
  const [expiresAt, setExpiresAt] = useState("");
  const [mood, setMood] = useState("pro");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const body = { type, amount, usageLimit };
      if (expiresAt) body.expiresAt = expiresAt;
      if (type === "subscription") body.mood = mood;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/admin/code/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess(`Code created: ${data.code}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg space-y-4">
      <h2 className="text-2xl font-bold text-center">Create Gift Code</h2>

      <div>
        <label className="block mb-1">Code Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="tasks">Tasks Code</option>
          <option value="subscription">Subscription Code</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">Usage Limit</label>
        <input
          type="number"
          value={usageLimit}
          onChange={(e) => setUsageLimit(parseInt(e.target.value))}
          min={1}
          className="w-full border rounded p-2"
        />
      </div>

      {type === "tasks" ? (
        <div>
          <label className="block mb-1">Number of Tasks</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            min={1}
            className="w-full border rounded p-2"
          />
        </div>
      ) : (
        <>
          <div>
            <label className="block mb-1">Plan</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="pro">Pro</option>
              <option value="max">Max</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Duration (months)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              min={1}
              className="w-full border rounded p-2"
            />
          </div>
        </>
      )}

      <div>
        <label className="block mb-1">Expires At (optional)</label>
        <input
          type="date"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Code"}
      </button>

      {error && <p className="text-red-600 text-center">{error}</p>}
      {success && <p className="text-green-600 text-center">{success}</p>}
    </form>
  );
};

export default CreateCode;