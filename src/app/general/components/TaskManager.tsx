"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import type { Id } from "../../../../convex/_generated/dataModel";

export function TaskManager() {
  const tasks = useQuery(api.tasks.getTasks);
  const addTask = useMutation(api.tasks.addTask);
  const toggleTask = useMutation(api.tasks.toggleTask);
  const deleteTask = useMutation(api.tasks.deleteTask);
  const [newTask, setNewTask] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      addTask({ text: newTask.trim() });
      setNewTask("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Task Manager</h1>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {tasks?.map((task) => (
          <div
            key={task._id}
            className="flex items-center gap-3 p-3 border border-gray-200 rounded-md"
          >
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => toggleTask({ id: task._id })}
              className="w-4 h-4 text-blue-600"
            />
            <span
              className={`flex-1 ${
                task.isCompleted
                  ? "line-through text-gray-500"
                  : "text-gray-900"
              }`}
            >
              {task.text}
            </span>
            <button
              onClick={() => deleteTask({ id: task._id })}
              className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
            >
              Delete
            </button>
          </div>
        ))}
        {tasks?.length === 0 && (
          <p className="text-center text-gray-500 py-4">No tasks yet!</p>
        )}
      </div>
    </div>
  );
}