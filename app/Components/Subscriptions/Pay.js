"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Pay = ({ plan }) => {
  const router = useRouter();
  const token = Cookies.get("token");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [otp, setOtp] = useState("");
  const [success, setSuccess] = useState(null);
  const [otpDisabled, setOtpDisabled] = useState(false);
  const [timer, setTimer] = useState(0);

  // عند تحميل الصفحة، يتم التحقق مما إذا كان قد تم إرسال OTP من قبل
  useEffect(() => {
    const lastSentTime = localStorage.getItem("otpLastSentTime");
    if (lastSentTime) {
      const timePassed = Math.floor((Date.now() - lastSentTime) / 1000);
      if (timePassed < 60) {
        setOtpDisabled(true);
        setTimer(60 - timePassed);
      }
    }
  }, []);

  // تحديث العداد وإعادة تمكين زر الإرسال عند انتهاء الوقت
  useEffect(() => {
    let interval;
    if (otpDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setOtpDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpDisabled]);

  // إعادة تعيين الرسائل بعد 3 ثوانٍ عند ظهورها
  useEffect(() => {
    if (success || error) {
      const timeoutId = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [success, error]);

  const sendOtp = async (e) => {
    e.preventDefault();
    if (otpDisabled) return;
    setLoading(true);
    setOtpDisabled(true);
    try {
      const res = await fetch("https://back-money.vercel.app/api/pay/visa/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cardNumber }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("OTP sent successfully");
        localStorage.setItem("otpLastSentTime", Date.now());
        setTimer(60);
      } else {
        setError(data.message || "Failed to send OTP");
        setOtpDisabled(false); // في حالة الفشل نعيد تمكين الزر
      }
    } catch (err) {
      setError(err.message || "An error occurred");
      setOtpDisabled(false);
    }
    setLoading(false);
  };

  const pay = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const req = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/pay/mood`, {
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
      });
      const data = await req.json();
      if (req.ok) {
        setSuccess("Payment successful");
      } else {
        setError(data.message || "Failed to process payment");
      }
    } catch (error) {
      setError(error.message || "An error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col">
      {success && <h1 className="text-white fixed top-0">{success}</h1>}
      {error && <h1 className="text-white fixed top-10">{error}</h1>}
      <div className="flex flex-col w-96 bg-slate-800 p-5 rounded-md mt-20">
        <h2 className="text-white text-center bg-gray-950 p-2 rounded">
          Payment using Visa Card on the <a className="underline text-blue-400" href='https://front-money-cash.vercel.app'>App Money</a>
        </h2>
        <form className="flex flex-col gap-2" onSubmit={pay}>
          <div className="flex flex-col">
            <label className="text-white">Card Number</label>
            <input
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="p-1 rounded-md bg-white"
              type="text"
              placeholder="1234 5678 9012 3456"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-white">CVV</label>
              <input
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="p-1 rounded-md bg-white"
                type="text"
                placeholder="123"
              />
            </div>
            <div className="flex-1">
              <label className="text-white">Expiration Date</label>
              <input
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="p-1 rounded-md w-full bg-white"
                type="text"
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-around">
            <div className="flex flex-col">
              <label className="text-white">OTP</label>
              <div className="flex items-center gap-2">
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="p-1 rounded-md w-28 bg-white"
                  type="text"
                  placeholder="1234"
                  maxLength={4}
                />
                <button
                  onClick={sendOtp}
                  className={`bg-blue-400 p-1 rounded text-white ${
                    otpDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                  }`}
                  disabled={otpDisabled || loading}
                >
                  {otpDisabled ? `Wait ${timer}s` : "Send"}
                </button>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="cursor-pointer bg-blue-400 p-2 rounded-md text-white hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay"}
          </button>
        </form>
        {success && <p className="text-green-500 mt-2">{success}</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default Pay;
