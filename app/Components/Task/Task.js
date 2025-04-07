"use client";
import React from "react";
import io from "socket.io-client";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Update from "./Update";
import { Pencil, Trash2 } from "lucide-react";
import Delete from "./Delete";
import { useSocket } from "@/app/socketContext";

const Task = () => {
  const token = Cookies.get("token");
  const [tasks, setTasks] = useState([]);
  const [loding, setLoding] = useState(false);
  const [error, setError] = useState(null);
  const userId = Cookies.get("userId");
  const [openUpdateId, setOpenUpdateId] = useState(null);
  const [openDeleteId, setOpenDeleteId] = useState(null);
  const socket = useSocket();

  const fatech = async () => {
    try {
      setLoding(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/task/tasks`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setTasks(data.tasks);
      } else {
        setError(data);
      }
    } catch (error) {
      setError(error);
      console.log(error);
    } finally {
      setLoding(false);
    }
  };

  useEffect(() => {
    fatech();

    if (socket) {
      socket.emit("register-user", userId);

      socket.on("task-updated", (data) => {
        if (data.action === "create" && data.task) {
          setTasks((prev) => [...prev, data.task]);
        } else if (data.action === "update" && data.task) {
          setTasks((prev) =>
            prev.map((task) =>
              task._id === data.task._id ? data.task : task
            )
          );
        } else if (data.action === "delete" && data.taskId) {
          setTasks((prev) =>
            prev.filter((task) => task._id !== data.taskId)
          );
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("task-updated");
      }
    };
  }, [userId, socket]);

  return (
    <div>
      {tasks.map((task) => (
        <div
          key={task._id}
          className="flex w-full items-center justify-between p-2 border-b border-gray-600"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <input
                className="cursor-pointer"
                type="checkbox"
                checked={task.status}
                onChange={async () => {
                  try {
                    const res = await fetch(
                      `${process.env.NEXT_PUBLIC_DOMAIN}/api/task/status/${task._id}`,
                      {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ status: !task.status }),
                      }
                    );

                    if (res.ok) {
                      const data = await res.json();
                      setTasks((prev) =>
                        prev.map((t) =>
                          t._id === task._id
                            ? { ...t, status: data.task.status }
                            : t
                        )
                      );
                    } else {
                      console.error("Failed to update task status");
                    }
                  } catch (error) {
                    console.error("Error updating task status:", error);
                  }
                }}
              />
              <h3
                className={`${
                  task.status ? "line-through opacity-50" : ""
                } break-words whitespace-normal`}
              >
                {task.title}
              </h3>
            </div>
            <p
              className={`${
                task.status ? "line-through opacity-30" : "opacity-60"
              } break-words whitespace-normal`}
            >
              {task.body}
            </p>
          </div>

          <div>
            <button
              className="mr-2 hover:text-blue-600 cursor-pointer opacity-30 hover:opacity-100"
              onClick={() => setOpenUpdateId(task._id)}
            >
              <Pencil size={16} />
            </button>

            {openUpdateId === task._id && (
              <Update task={task} onClose={() => setOpenUpdateId(false)} />
            )}
            {openDeleteId === task._id && (
              <Delete task={task} onClose={() => setOpenDeleteId(false)} />
            )}
            <button
              onClick={() => setOpenDeleteId(task._id)}
              className="hover:text-red-800 cursor-pointer opacity-30 hover:opacity-100"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Task;
