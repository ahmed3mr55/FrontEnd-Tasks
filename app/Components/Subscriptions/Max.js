"use client";
import React from 'react';
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Max = () => {
    const router = useRouter();
    const token = Cookies.get("token");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mood, setMood] = useState(null);
    const getMood = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN}/api/pay/mood`,{
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
        const data = await res.json();
        if (res.ok) {
          setMood(data.mood);
        } else {
          setError(data.message || "Failed to fetch mood");
        }
      } catch (error) {
        setError(error.message || "An error occurred");
      }finally {
        setLoading(false);
      }
    }
    useEffect(() => {
      getMood();
    }, []);
  return (
    <div className="p-4 text-center text-white shadow-md bg-[#1f283b] rounded-lg min-h-[400px] flex flex-col justify-between">
      <div>
        <p className="text-lg font-semibold text-blue-600 py-5">Max</p>
        <h3 className="text-2xl font-bold">
          750 EGP<span className="text-sm text-gray-400"> / month</span>
        </h3>
        <ul className="mt-7 pl-6 space-y-2 text-left text-[#ddd] list-disc">
          <li>Create up to 30 tasks</li>
          <li>Each task can be edited up to 15 times</li>
          <li>Profile update allowed up to 15 times</li>
          <li>Early access to updates before everyone else</li>
          <li>Technical support chat with response within 1 hour</li>
        </ul>
      </div>
      {mood === "max" ? (
        <button className="w-full py-2 text-white bg-[#e33058] border border-[#e33058] mt-4 rounded-md cursor-pointer hover:bg-[#e33058]">
          Subscribed
        </button>
      ) : (
        <button onClick={() => router.push("/Components/Subscriptions/max")} className="w-full py-2 text-white bg-transparent border border-[#e33058] mt-4 rounded-md cursor-pointer hover:bg-[#e33058]">
          Subscribe
        </button>
      )}
    </div>
  );
};

export default Max;
