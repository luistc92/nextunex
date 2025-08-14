"use client";

import { useState } from "react";
import { TaskSidebar } from "./_components/TaskSidebar";
import { TaskFormRenderer } from "./_components/TaskFormRenderer";
import type { Doc } from "../../../convex/_generated/dataModel";

export default function AppLayout() {
  const [selectedTask, setSelectedTask] = useState<Doc<"tasks"> | null>(null);

  const handleTaskSelect = (task: Doc<"tasks"> | null) => {
    setSelectedTask(task);
  };

  const handleTaskComplete = () => {
    // Refresh the task list by clearing selection
    setSelectedTask(null);
  };


  const getPageTitle = () => {
    return "Panel de Tareas";
  };

  const getPageSubtitle = () => {
    return "Sub"
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-black flex overflow-hidden">
      {/* Fixed Task Sidebar */}
      <div className="w-80 flex-shrink-0">
        <TaskSidebar
          selectedTaskId={selectedTask?._id || null}
          onTaskSelect={handleTaskSelect}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Fixed Top Navbar */}
        <nav className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div className="px-6 py-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50">
              {getPageTitle()}
            </h1>
            {getPageSubtitle() && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {getPageSubtitle()}
              </p>
            )}
          </div>
        </nav>

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <TaskFormRenderer
          task={selectedTask}
          onTaskComplete={handleTaskComplete}
          />
        </div>
      </div>
    </div>
  );
}
