"use client";
import React from "react";
import Update from "./Update";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { LogOut } from "lucide-react";
import CodeRedeem from "../GiftCode/CodeRedeem";
import CreateCode from "../GiftCode/Create";

const Page = () => {
  const token = Cookies.get("token");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const getUser = async () => {
    setLoading(true);
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
      } else {
        setError(data.message || "Failed to fetch user");
      }
    } catch (error) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };
  const getDaysLeft = (dateStr) => {
    if (!dateStr) return 0;
    const now = new Date();
    const endDate = new Date(dateStr);
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  const handlePlanPrice = (plan) => {
    if (plan === "basic") {
      return 0;
    } else if (plan === "pro") {
      return 650;
    } else if (plan === "max") {
      return 750;
    }
    return 0;
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userId");
    router.push("/auth/login");
  };
  return (
    <div className="bg-gray-50 flex items-center justify-center p-4 flex-col">
      <div className="w-full md:w-1/2  rounded-lg p-8 space-y-6">
        {/* Header */}
        <header className="flex justify-between items-center border-b pb-4">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">
              {user?.firstName + " " + user?.lastName}
            </h3>
            <p className="mt-1 text-gray-600">
              Email: <span className="font-medium">{user?.email || "N/A"}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg text-gray-700">
              Current Plan:{" "}
              <span className="font-bold text-blue-600">
                {user?.mood || "N/A"}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Expiry:{" "}
              <span className="font-medium">
                {formatDate(user?.subscriptionEndDate)}
              </span>{" "}
              ({getDaysLeft(user?.subscriptionEndDate)} days left)
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-col sm:flex-row justify-between items-center">
          <div>
            <p className="text-gray-700">
              Payment Deadline:{" "}
              <span className="font-semibold">
                {formatDate(user?.subscriptionEndDate)}
              </span>
            </p>
            <p className="text-gray-700">
              Payment Amount:{" "}
              <span className="font-semibold">
                {handlePlanPrice(user?.mood)} EGP
              </span>
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              className="px-6 py-3 bg-red-500 cursor-pointer text-white rounded-md hover:bg-red-600 transition"
              onClick={() => router.push("/Components/Subscriptions")}
            >
              Unsubscribe
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex justify-center flex-col items-center">
          <div>
            <button
              onClick={handleLogout}
              className="bg-red-600 flex items-center gap-1 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-red-700"
            >
              Logout <LogOut size={20} />
            </button>
          </div>
          <p className="text-white mt-3 p-2 bg-gray-400 rounded-md">
            Redeem Code Gift
          </p>
          <CodeRedeem />
          <p
            onClick={() => router.push("/Components/GiftCode")}
            className="text-gray-500 text-sm underline cursor-pointer"
          >
            Show more Codes
          </p>
          {user?.isAdmin && <CreateCode />}
        </footer>
      </div>
      <Update />
    </div>
  );
};

export default Page;
