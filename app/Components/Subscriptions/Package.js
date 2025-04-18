"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Loading from "../Loading/Loading";
import { useRouter } from "next/navigation";

const Package = ({ currentPackage, text, onClick, price }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [payTasksPlan, setPayTasksPlan] = useState(null);

  const getHistoryPackage = async () => {
    const token = Cookies.get("token");
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/task/packageHistory`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) setPayTasksPlan(data.payTasksPlan);
      else throw new Error(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async () => {
    router.push(`/Components/Subscriptions/${currentPackage}`);
  };

  useEffect(() => {
    if (!payTasksPlan) getHistoryPackage();
  }, []);

  return (
    <div className="p-4 text-center text-white shadow-md bg-[#1f283b] rounded-lg min-h-[400px] flex flex-col justify-between">
      {loading && <Loading />}
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <p className="text-lg font-semibold text-blue-600 py-5 capitalize">
          {currentPackage}
        </p>
        <h3 className="text-2xl font-bold">
          {price} EGP<span className="text-sm text-gray-400"> / one</span>
        </h3>
        <ul className="mt-7 pl-6 space-y-2 text-left text-[#ddd] list-disc">
          <li className="text-md font-semibold">{text}</li>
        </ul>
      </div>
      {payTasksPlan === currentPackage ? (
        <button
          onClick={handleClick}
          className="w-full py-2 text-white bg-[#e33058] border border-[#e33058] mt-4 rounded-md cursor-pointer hover:bg-[#e33058]"
        >
          {loading ? "Loading..." : "Buy Again"}
        </button>
      ) : (
        <button
          onClick={handleClick}
          className="w-full py-2 text-white bg-transparent border border-[#e33058] mt-4 rounded-md cursor-pointer hover:bg-[#e33058]"
        >
          {loading ? "Loading..." : "Buy Now"}
        </button>
      )}
    </div>
  );
};

export default Package;
