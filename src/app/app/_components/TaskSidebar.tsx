"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock, FileText, Truck } from "lucide-react";
import type { Doc } from "../../../../convex/_generated/dataModel";

interface TaskSidebarProps {
  selectedTaskId: string | null;
  onTaskSelect: (task: Doc<"tasks"> | null) => void;
}

export function TaskSidebar({ selectedTaskId, onTaskSelect }: TaskSidebarProps) {
  const tasks = useQuery(api.internalAPI.tasks.getTasks) as Doc<"tasks">[] | undefined;

  // Separate regular and permanent tasks
  const regularTasks = tasks?.filter(task => !task.permanent) || [];
  const permanentTasks = tasks?.filter(task => task.permanent) || [];



  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const pendingTasks = regularTasks.filter(task => !task.isCompleted);


  return (
    <div className="h-full bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800">
      <div className="flex flex-col h-full">
        {/* Top Bar - matches navbar height */}
        <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div className="px-6 py-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
              Tareas
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Gestión de tareas
            </p>
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div className="p-4">
              <div className="space-y-2">
                {pendingTasks.map((task) => (
                  <button
                    key={task._id}
                    onClick={() => onTaskSelect(task)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border transition-colors cursor-pointer",
                      selectedTaskId === task._id
                        ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                        : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {task.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatDate(task.createdAt || task._creationTime)}
                          </p>
                          {task.asignee && (
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              Asignado por: {task.asignee}
                            </p>
                          )}
                        </div>
                      </div>
                      <Circle className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}



          {/* Empty State */}
          {pendingTasks.length === 0 && (
            <div className="p-8 text-center">
              <Circle className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                No hay tareas
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Las tareas aparecerán aquí cuando sean asignadas.
              </p>
            </div>
          )}
        </div>

        {/* Permanent Tasks - Bottom */}
        <div className="px-4 py-4 border-t-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 flex-shrink-0">
          <h3 className="text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-3">
            Tareas Permanentes ({permanentTasks.length})
          </h3>
          <div className="space-y-2">
            {permanentTasks.map((task) => (
              <button
                key={task._id}
                onClick={() => onTaskSelect(task)}
                className={cn(
                  "w-full text-left p-3 rounded-lg border transition-colors cursor-pointer",
                  selectedTaskId === task._id
                    ? "bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 ring-2 ring-blue-500"
                    : "bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                )}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {task.name}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
