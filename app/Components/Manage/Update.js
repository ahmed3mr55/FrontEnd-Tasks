"use client";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const Update = () => {
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [done, setDone] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [plan, setPlan] = useState("");
  
  const update = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => (value?.trim?.() || value) !== "")
      );
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/user/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(filteredData),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setDone("User is updated successfully");
      } else {
        setError(data.message || "Failed to update user");
      }
    } catch (error) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getUser = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/user/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setFormData({
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          password: data.user.password,
        });
        setPlan(data.user.mood);
      } else {
        setError(data.message || "Failed to fetch user");
      }
    } catch (error) {
      setError(error.message || "An error occurred");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setDone("");
      setError("");
    }, 3000)
    return () => clearTimeout(timer);
  }, [done, error]);

  return (
    <form className='flex flex-col p-2 mt-3' onSubmit={update}>
        {error && <p className='text-red-500'>{error}</p>}
        {done && <p className='text-green-500'>{done}</p>}
      <div className='flex flex-row gap-2'>
        <div className='flex flex-col'>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            name="firstName"
            className='border p-1'
          />
        </div>
        <div className='flex flex-col'>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className='border p-1'
          />
        </div>
      </div>

      <div className='flex flex-row gap-2'>
        <div className='flex flex-col'>
          <label htmlFor='email'>Email</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className='border p-1'
          />
        </div>
        <div className='flex flex-col'>
          <label htmlFor='password'>Password</label>
          <input
            type="password"
            onChange={handleChange}
            name="password"
            className='border p-1'
          />
        </div>
      </div>

      <div className='flex flex-row gap-2'>
        <div className='flex flex-col'>
          <label htmlFor='plan'>Plan</label>
          <input
            type="text"
            value={plan}
            className='border p-1 cursor-not-allowed opacity-50'
            disabled
          />
        </div>
      </div>
      <button type='submit' className='bg-blue-500 text-white p-2 my-3 cursor-pointer'>Update</button>
    </form>
  );
};

export default Update;
