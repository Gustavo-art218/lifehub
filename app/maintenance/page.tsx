"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import AuthGuard from "@/components/AuthGuard";
import { db } from "@/lib/firebase";

import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function MaintenancePage() {

  const [taskName, setTaskName] =
    useState("");

  const [dueDate, setDueDate] =
    useState("");

  const [tasks, setTasks] =
    useState<any[]>([]);

  useEffect(() => {

    const q = query(
      collection(db, "maintenance"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe =
      onSnapshot(q, (snapshot) => {

        const items: any[] = [];

        snapshot.forEach((docItem) => {

          items.push({
            id: docItem.id,
            ...docItem.data(),
          });

        });

        setTasks(items);

      });

    return () => unsubscribe();

  }, []);

  const addTask = async () => {

    if (!taskName || !dueDate) {
      alert("Complete all fields");
      return;
    }

    try {

      await addDoc(
        collection(db, "maintenance"),
        {
          taskName,
          dueDate,
          status: "Pending",
          createdAt: new Date(),
        }
      );

      setTaskName("");
      setDueDate("");

      alert("Task Added");

    } catch (error) {

      console.error(error);

      alert("Failed to save task");

    }

  };

  const toggleTaskStatus = async (
    taskId: string,
    currentStatus: string
  ) => {

    try {

      await updateDoc(
        doc(
          db,
          "maintenance",
          taskId
        ),
        {
          status:
            currentStatus === "Completed"
              ? "Pending"
              : "Completed",
        }
      );

    } catch (error) {

      console.error(error);

      alert(
        "Failed to update task"
      );

    }

  };

  return (

    <AuthGuard>

      <div className="flex">

      <Sidebar />

      <main className="flex-1 min-h-screen bg-slate-100 p-6 pb-24">

        <div className="mb-8">

          <h1 className="text-4xl font-bold">
            Maintenance
          </h1>

          <p className="text-slate-500 mt-2">
            Track recurring maintenance tasks
          </p>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg mb-8">

          <h2 className="text-2xl font-bold mb-4">
            Add Maintenance Task
          </h2>

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Car Service"
              value={taskName}
              onChange={(e) =>
                setTaskName(e.target.value)
              }
              className="w-full border rounded-2xl p-4"
            />

            <input
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(e.target.value)
              }
              className="w-full border rounded-2xl p-4"
            />

            <button
              onClick={addTask}
              className="bg-slate-900 text-white px-6 py-3 rounded-2xl"
            >
              Save Task
            </button>

          </div>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold">
              Maintenance Schedule
            </h2>

            <span className="text-slate-500">
              {tasks.length} Total
            </span>

          </div>

          {tasks.length === 0 ? (

            <p className="text-slate-500">
              No maintenance tasks added yet.
            </p>

          ) : (

            <div className="space-y-4">

              {tasks.map((task) => (

                <div
                  key={task.id}
                  className="border rounded-2xl p-5 flex justify-between items-center"
                >

                  <div>

                    <h3 className="font-bold text-lg">
                      {task.taskName}
                    </h3>

                    <p className="text-slate-500">
                      Due: {task.dueDate}
                    </p>

                  </div>

                  <div className="text-right">

                    <span
                      className={
                        task.status === "Completed"
                          ? "text-green-600 font-medium"
                          : "text-yellow-600 font-medium"
                      }
                    >
                      {task.status}
                    </span>

                    <button
                      onClick={() =>
                        toggleTaskStatus(
                          task.id,
                          task.status
                        )
                      }
                      className="block mt-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm"
                    >
                      {task.status === "Completed"
                        ? "Mark Pending"
                        : "Mark Complete"}
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        <BottomNav />

      </main>

    </div>
</AuthGuard>

  );
}