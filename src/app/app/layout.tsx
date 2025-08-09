"use client";

import { useState } from "react";
import { TaskSidebar } from "./_components/TaskSidebar";
import { TaskFormRenderer } from "./_components/TaskFormRenderer";

interface Task {
  _id: string;
  type: "subirReporteMovimientos";
  isCompleted: boolean;
  createdAt: number;
  asignee?: string;
  variables?: any;
}

export default function AppLayout() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskSelect = (task: Task | null) => {
    setSelectedTask(task);
  };

  const handleTaskComplete = () => {
    // Refresh the task list by clearing selection
    setSelectedTask(null);
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex">
      {/* Task Sidebar */}
      <TaskSidebar
        selectedTaskId={selectedTask?._id || null}
        onTaskSelect={handleTaskSelect}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <nav className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
          <div className="px-6 py-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50">
              {selectedTask ? "Formulario de Tarea" : "Panel de Tareas"}
            </h1>
            {selectedTask && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {selectedTask.type === "subirReporteMovimientos" ? "Subir Reporte de Movimientos" : selectedTask.type}
              </p>
            )}
          </div>
        </nav>

        {/* Task Form Content */}
        <div className="flex-1 overflow-hidden">
          <TaskFormRenderer
            task={selectedTask}
            onTaskComplete={handleTaskComplete}
          />
        </div>
      </div>
    </div>
  );
}
