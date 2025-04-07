import React from 'react';
import Pay from "../Pay";

const page = async ({ params }) => {
  const { plan } = await params;
  let price = "";
  
  if (plan === "basic") {
    price = "150";
  } else if (plan === "pro") {
    price = "650";
  } else if (plan === "max") {
    price = "750";
  } else {
    return (
      <div className="w-full min-h-screen bg-[#5c539d] flex items-center justify-center">
        <p className="text-white text-xl">Invalid plan</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#5c539d]">
      <p className="text-center text-white pt-6 text-lg">
        You are about to subscribe to the <span className="font-bold uppercase">{plan}</span> plan for <span className="font-bold">{price} EGP</span>
      </p>
      <Pay plan={plan} />
    </div>
  );
};

export default page;
