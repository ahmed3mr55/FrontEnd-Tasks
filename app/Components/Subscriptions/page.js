"use client";
import React from "react";
import Cookies from "js-cookie";
import Basic from "./Basic";
import Pro from "./Pro";
import Max from "./Max";
import Packages from "./Packages";

const page = () => {
  return (
    <div className="w-full min-h-screen bg-[#5c539d]">
      <h2 className="text-2xl font-bold text-white text-center py-5">
        Choose your plan
      </h2>
      <div
        className="w-[90%] max-w-[1100px] m-auto grid gap-4 mt-4 
    sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        <Basic />
        <Pro />
        <Max />
      </div>
      <h2 className="text-2xl font-bold text-white text-center py-5">Purchase additional packages</h2>
        <Packages />
    </div>
  );
};

export default page;
