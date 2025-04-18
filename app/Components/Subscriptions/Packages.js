import React from 'react';
import Package from './Package';

const Packages = () => {
  return (
    <div className="w-[90%] max-w-[1100px] m-auto grid gap-4 mt-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Package currentPackage="small" price="15" text="Add 5 tasks" />
      <Package currentPackage="medium" price="25" text="Add 10 tasks" />
      <Package currentPackage="large" price="50" text="Add 15 tasks" />
    </div>
  )
}

export default Packages
