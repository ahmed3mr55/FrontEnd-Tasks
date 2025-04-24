"use client";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { useTasks } from "../contexts/TaskContext";
import Update from "./Update";
import Delete from "./Delete";
import { Pencil, Trash2 } from "lucide-react";

const Task = () => {
  const { tasks, loading, error, updateTaskContext } = useTasks();
  const [openUpdateId, setOpenUpdateId] = useState(null);
  const [openDeleteId, setOpenDeleteId] = useState(null);

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      {tasks.length === 0 && (
        <div className="flex flex-col justify-center items-center h-[400px]">
          <img src="/images/empty.png" alt="s" />
          <h1 className="text-2xl font-bold text-gray-500">Empty</h1>
        </div>
      )}
      {tasks.map((task) => (
        <div
          key={task._id}
          className="flex w-full items-center justify-between p-2 border-b border-gray-600"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={task.status}
                className="cursor-pointer"
                onChange={async () => {
                  try {
                    const res = await fetch(
                      `${process.env.NEXT_PUBLIC_DOMAIN}/api/task/status/${task._id}`,
                      {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${Cookies.get("token")}`,
                        },
                        body: JSON.stringify({ status: !task.status }),
                      }
                    );
                    const data = await res.json();
                    if (res.ok) {
                      updateTaskContext(data.task);
                    } else {
                      console.error("Failed to update task status");
                    }
                  } catch (err) {
                    console.error("Error updating task status:", err);
                  }
                }}
              />
              <h3 className={task.status ? "line-through opacity-50" : ""}>
                {task.title}
              </h3>
            </div>
            <p
              className={task.status ? "line-through opacity-30" : "opacity-60"}
            >
              {task.body}
            </p>
          </div>
          <div>
            <button
              onClick={() => setOpenUpdateId(task._id)}
              className="mr-2 hover:text-blue-600 cursor-pointer opacity-50 hover:opacity-100"
            >
              <Pencil size={16} />
            </button>
            {openUpdateId === task._id && (
              <Update task={task} onClose={() => setOpenUpdateId(null)} />
            )}
            <button
              onClick={() => setOpenDeleteId(task._id)}
              className="hover:text-red-800 opacity-50 hover:opacity-100 cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
            {openDeleteId === task._id && (
              <Delete task={task} onClose={() => setOpenDeleteId(null)} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Task;
