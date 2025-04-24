// components/Update.jsx
"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const Update = () => {
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [plan, setPlan] = useState("");


  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setFormData({
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          password: "",
        });
        setPlan(data.user.mood);
      })
      .catch((err) => setError(err.message));
  }, [token]);

  useEffect(() => {
    if (error || done) {
      const t = setTimeout(() => {
        setError("");
        setDone("");
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [error, done]);

  const update = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v.trim() !== "")
    );
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/user/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setDone("Profile updated successfully");
        setUser(data.user);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <form
      onSubmit={update}
      className="max-w-md mx-auto p-4 bg-white rounded shadow space-y-4
                 xs:p-2 xs:space-y-2"
    >
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {done && <p className="text-green-500 text-sm">{done}</p>}

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
        <div className="flex-1">
          <label className="block mb-1 text-gray-700">First Name</label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border rounded p-2 focus:outline-none focus:ring"
            placeholder="First Name"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-gray-700">Last Name</label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border rounded p-2 focus:outline-none focus:ring"
            placeholder="Last Name"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
        <div className="flex-1">
          <label className="block mb-1 text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded p-2 focus:outline-none focus:ring"
            placeholder="you@example.com"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-gray-700">Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded p-2 focus:outline-none focus:ring"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 text-gray-700">Plan</label>
        <input
          value={plan}
          disabled
          className="w-full bg-gray-100 border rounded p-2 cursor-not-allowed opacity-70"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Updating..." : "Update"}
      </button>
    </form>
  );
};

export default Update;
