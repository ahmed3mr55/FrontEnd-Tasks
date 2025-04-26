"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const CodePage = () => {
  const token = Cookies.get("token");
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCodes = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN}/api/pay/codes`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch codes");
        setCodes(data.codes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCodes();
  }, [token]);

  if (loading) {
    return <p className="text-center mt-10">Loading codes...</p>;
  }
  if (error) {
    return <p className="text-center mt-10 text-red-600">Error: {error}</p>;
  }
  if (!codes.length) {
    return <p className="text-center mt-10">No codes available.</p>;
  }

  return (
    <>
        <h1 className="text-2xl font-bold text-center mt-8">Codes Available</h1>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {codes.map((code) => {
          // dynamic colors based on type
          const isTask = code.type === "tasks";
          const bgColor = isTask
            ? "bg-green-50 dark:bg-green-900"
            : "bg-blue-50 dark:bg-blue-900";
          const borderColor = isTask
            ? "border-green-200 dark:border-green-700"
            : "border-blue-200 dark:border-blue-700";

          return (
            <div
              key={code._id}
              className={`${bgColor} ${borderColor} border shadow-md rounded-lg p-5 space-y-2`}
            >
              <h3 className="text-xl font-semibold break-all text-white">
                {code.code}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Type: <span className="font-medium">{code.type}</span>
              </p>
              <p className="text-gray-700 dark:text-gray-200">
                <span className="font-medium">Amount:</span> {code.amount}{" "}
                {code.type === "tasks" ? "tasks" : "months"}
              </p>
              <p className="text-gray-700 dark:text-gray-200">
                <span className="font-medium">Usage Limit:</span>{" "}
                {code.usageLimit}
              </p>
              <p className="text-gray-700 dark:text-gray-200">
                <span className="font-medium">Used Count:</span>{" "}
                {code.usedCount}
              </p>
              {code.expiresAt && (
                <p className="text-gray-700 dark:text-gray-200">
                  <span className="font-medium">Expires At:</span>{" "}
                  {new Date(code.expiresAt).toLocaleDateString()}
                </p>
              )}
              {code.mood && (
                <p className="text-gray-700 dark:text-gray-200">
                  <span className="font-medium">Plan:</span> {code.mood}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CodePage;
