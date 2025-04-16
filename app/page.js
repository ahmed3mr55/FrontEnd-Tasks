"use client";
import React from "react";
import { useState } from "react";
import Search from "./Components/Search/Search";
import List from "./Components/List/List";
import AddTask from "./Components/AddTask/AddTask";
import { Plus } from "lucide-react";
import NavBar from "./Components/NavBar/NavBar";
import { TaskProvider } from "./Components/contexts/TaskContext";

export default function Home() {
  const [openCreate, setOpenCreate] = useState(false);
  return (

      <div className="p-1 flex flex-col  items-center ">
        <NavBar />
        <h1 className="text-2xl font-bold mb-4 uppercase">Todo List</h1>
        <Search />
        <List />
        <Plus
          size={50}
          className="cursor-pointer fixed bottom-7 right-7 p-1 text-white hover:bg-blue-600 bg-blue-700 rounded-full"
          onClick={() => setOpenCreate(true)}
        />
        {openCreate && <AddTask onClose={() => setOpenCreate(false)} />}
      </div>
  );
}
