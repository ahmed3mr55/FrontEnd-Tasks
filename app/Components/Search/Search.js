'use client';
import React from "react";
import Theme from "./Theme";

const Search = () => {
  return (
    <div className="grid grid-cols-[2fr_1fr] gap-4 items-center">
      <div>
        <input 
          type="text" 
          placeholder="Search note..." 
          className="w-full p-2 border border-blue-700 outline-none rounded-md" 
        />
      </div>
      <div className="flex gap-2">
        <select className="p-2 border text-white bg-blue-700">
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="uncompleted">Incomplete</option>
        </select>
        <div className="p-2 border text-white bg-blue-700 rounded-md">
          <Theme />
        </div>
      </div>
    </div>
  );
};

export default Search;
