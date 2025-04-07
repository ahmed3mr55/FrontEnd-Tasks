"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Basic = () => {
  const router = useRouter();
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mood, setMood] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(null);

  const getMood = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/pay/mood`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setMood(data.mood);
      } else {
        setError(data.message || "Failed to fetch mood");
      }
    } catch (error) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMood();
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const backToBasicPlan = async () => {
    try {
      setLoading(true);
      const req = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/pay/mood/basic`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await req.json();
      if (req.ok) {
        setSuccess("You have successfully switched to the basic plan.");
      } else {
        setError(data.message || "Failed to process payment");
      }
    } catch (error) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 text-center text-white shadow-md bg-[#1f283b] rounded-lg min-h-[400px] flex flex-col justify-between">
      {success && <p className="text-green-500 fixed top-0 right-0">{success}</p>}
      <div>
        <p className="text-lg font-semibold text-blue-600 py-5">Basic</p>
        <h3 className="text-2xl font-bold">
          0 EGP<span className="text-sm text-gray-400">/ month</span>
        </h3>
        <ul className="mt-7 pl-6 space-y-2 text-left text-[#ddd] list-disc">
          <li>Create up to 5 tasks</li>
          <li>Each task can be edited only once</li>
          <li>Profile update allowed only once</li>
          <li>Basic Email Support</li>
          <li>Access to Standard Features</li>
        </ul>
      </div>
      {mood === "basic" ? (
        <button className="w-full py-2 text-white bg-[#e33058] border border-[#e33058] mt-4 rounded-md cursor-pointer hover:bg-[#e33058]">
          Subscribed
        </button>
      ) : (
        <button
          onClick={handleOpenModal}
          className="w-full py-2 text-white bg-transparent border border-[#e33058] mt-4 rounded-md cursor-pointer hover:bg-[#e33058]"
        >
          Back to basic plan ?
        </button>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          {success ? (
            <div className="bg-green-100 border border-green-400 text-green-700 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Success!</h3>
              <p className="mb-6">{success}</p>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSuccess(null);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Are you sure you want to go back to the Basic plan?
                </h3>
                <p className="text-gray-600 text-sm">
                  After returning to the basic plan, you cannot get a money refund.
                </p>
              </div>
              <div className="flex justify-end gap-5">
                <button
                  className="px-4 py-2  cursor-pointer bg-gray-400 text-white rounded-md hover:bg-gray-500"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center"
                  onClick={backToBasicPlan}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Continue to basic plan"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Basic;
