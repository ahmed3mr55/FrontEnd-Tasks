"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function CodeDetails() {
  const token = Cookies.get("token");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [details, setDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchDetails = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/pay/code/${encodeURIComponent(
          code
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch code");
      setDetails(data.code);
      setShowModal(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      setError("");
        const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/pay/redeem`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ code }),
        })
        const data = await res.json();
        if (res.ok) {
            setShowModal(false);
            setDetails(null);
            setSuccess("Code redeemed successfully!");
        }
        else throw new Error(data.message || "Failed to redeem code");
    } catch (error) {
      setError(error.message || "Failed to redeem code");
        
    }finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setError("");
        setShowModal(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, showModal]);

  return (
    <>
      {showModal && details && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded max-w-md w-full space-y-4">
            <h2 className="text-xl font-bold">Code Details</h2>
            <p>
              <strong>Code:</strong> {details.code}
            </p>
            <p>
              <strong>Type:</strong> {details.type}
            </p>
            {details.type === "tasks" ? (
              <p>
                <strong>Amount:</strong> +{details.amount} tasks
              </p>
            ) : (
              <>
                <p>
                  <strong>Plan:</strong> {details.mood}
                </p>
                <p>
                  <strong>Months:</strong> {details.amount}
                </p>
              </>
            )}
            <p>
              <strong>Expires:</strong>{" "}
              {new Date(details.expiresAt).toLocaleDateString()}
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-400 cursor-pointer"
              >
                Close
              </button>
              <button onClick={handleRedeem} className="px-4 py-2 bg-blue-600 cursor-pointer hover:bg-blue-500 text-white rounded">
                {loading ? "Loading..." : "Redeem"}
              </button>
            </div>
          </div>
        </div>
      )}
      {success && <p className="text-white p-2 rounded bg-green-700 fixed top-10 left-center m-auto text-center">Code redeemed successfully!</p>}
      {error && <p className="bg-red-500 text-white p-2 rounded fixed top-10 left-center m-auto text-center">{error}</p>}
      <form
        onSubmit={fetchDetails}
        className="max-w-sm mx-auto p-4 space-y-4 rounded "
      >
        <label htmlFor="code" className="block font-medium">
          Enter Code
        </label>
        <div className="flex gap-2">
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
            placeholder="e.g. ABCD1234"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 cursor-pointer hover:bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {loading ? "Loading..." : "Redeem"}
          </button>
        </div>
      </form>
    </>
  );
}
