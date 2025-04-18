"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Pay = ({ plan }) => {
  const router = useRouter();
  const token = Cookies.get("token");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [otp, setOtp] = useState("");

  const [otpDisabled, setOtpDisabled] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const lastSent = localStorage.getItem("otpLastSentTime");
    if (lastSent) {
      const lastMs = parseInt(lastSent, 10);
      const secondsPassed = Math.floor((Date.now() - lastMs) / 1000);
      if (secondsPassed < 60) {
        setOtpDisabled(true);
        setTimer(60 - secondsPassed);
      }
    }
  }, []);

  useEffect(() => {
    if (!otpDisabled) return;
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setOtpDisabled(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [otpDisabled]);

  useEffect(() => {
    if (!success && !error) return;
    const timeout = setTimeout(() => {
      setSuccess(null);
      setError(null);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [success, error]);

  const sendOtp = async (e) => {
    e.preventDefault();
    if (otpDisabled) return;

    const now = Date.now();
    localStorage.setItem("otpLastSentTime", now.toString());
    setOtpDisabled(true);
    setTimer(60);
    setLoading(true);

    try {
      const res = await fetch(
        `https://back-money.vercel.app/api/pay/visa/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cardNumber }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setSuccess("OTP sent successfully");
      } else {
        throw new Error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError(err.message);
      setOtpDisabled(false);
      setTimer(0);
    } finally {
      setLoading(false);
    }
  };

  const pay = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/pay/mood`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mood: plan,
            cardNumber,
            cvv,
            expiryDate,
            otp,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setSuccess("Payment successful");
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        throw new Error(data.message || "Failed to process payment");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      {success && (
        <div className="fixed top-4 bg-green-600 text-white p-2 rounded">
          {success}
        </div>
      )}
      {error && (
        <div className="fixed top-4 bg-red-600 text-white p-2 rounded">
          {error}
        </div>
      )}

      <div className="w-96 bg-slate-800 p-6 rounded-md">
        <h2 className="text-white text-center mb-4">
          Payment using Visa Card using <a target="_blank" className="text-blue-500 underline " href='https://front-money-cash.vercel.app'>App money</a>
        </h2>
        <form onSubmit={pay} className="space-y-4">
          <div>
            <label className="text-white block">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              className="w-full p-2 rounded bg-white"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-white block">CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                className="w-full p-2 rounded bg-white"
              />
            </div>
            <div className="flex-1">
              <label className="text-white block">Expiry Date</label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full p-2 rounded bg-white"
              />
            </div>
          </div>
          <div>
            <label className="text-white block">OTP</label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="1234"
                maxLength={4}
                className="w-28 p-2 rounded bg-white"
              />
              <button
                onClick={sendOtp}
                disabled={otpDisabled || loading}
                className={`p-2 rounded text-white ${
                  otpDisabled
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-400 hover:bg-blue-600"
                }`}
              >
                {otpDisabled ? `Wait ${timer}s` : "Send OTP"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 rounded text-white bg-blue-400 hover:bg-blue-600"
          >
            {loading ? "Processing..." : "Pay"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Pay;