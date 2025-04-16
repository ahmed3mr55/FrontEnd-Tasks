"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  Crown,
  Star,
  Award,
  LogOut,
  Settings,
  CalendarCheck,
} from "lucide-react";
import Link from "next/link";

const NavBar = () => {
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
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
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderPlanIcon = (plan) => {
    switch (plan?.toLowerCase()) {
      case "basic":
        return <Star className="text-yellow-500" size={16} />;
      case "pro":
        return <Crown className="text-blue-500" size={16} />;
      case "max":
        return <Award className="text-purple-500" size={16} />;
      default:
        return <Star className="text-gray-500" size={16} />;
    }
  };

  useEffect(() => {
    fetchUser();

  },[]);

  return (
    <div className="w-full bg-blue-700 text-white p-4 shadow-md">
      {error && (
        <div className="mb-2 text-center text-red-300 text-sm">{error}</div>
      )}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-900 to-indigo-900 w-10 h-10 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-lg sm:text-base font-bold">
            {user?.firstName?.charAt(0) || "U"}
          </div>
          <div>
            <p className="font-semibold text-base sm:text-sm">
              {user ? `${user.firstName} ${user.lastName}` : "User"}
            </p>
            {loading && <p className="text-xs text-blue-200">Loading...</p>}
          </div>
        </div>

        {/* معلومات المستخدم */}
        <div className="grid grid-cols-3 sm:flex sm:items-center sm:gap-6 text-xs sm:text-sm text-center gap-y-2">
          <div>
            <p className="opacity-75">Plan</p>
            <div className="flex justify-center items-center gap-1">
              {renderPlanIcon(user?.mood)}
              <span className="font-medium">{user?.mood || "Lodging"}</span>
            </div>
          </div>
          <div>
            <p className="opacity-75">Plans</p>
            <Link
              href="/Components/Subscriptions"
              className="font-medium underline"
            >
              <CalendarCheck className="hover:text-blue-300 mx-auto" size={16} />
            </Link>
          </div>
          <div>
            <p className="opacity-75">Tasks</p>
            <p className="font-medium">{user?.tasks || "0"}</p>
          </div>
          <div>
            <p className="opacity-75">Completed</p>
            <p className="font-medium">{user?.tasksCompleted || "0"}</p>
          </div>
          <div>
            <p className="opacity-75">Settings</p>
            <Link href="/Components/Manage" className="font-medium underline">
              <Settings className="hover:text-blue-300 mx-auto" size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
