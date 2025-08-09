"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Task {
  _id: string;
  type: "subirReporteMovimientos";
  isCompleted: boolean;
  createdAt: number;
  asignee?: string;
  variables?: any;
}

interface TaskSidebarProps {
  selectedTaskId: string | null;
  onTaskSelect: (task: Task | null) => void;
}

export function TaskSidebar({ selectedTaskId, onTaskSelect }: TaskSidebarProps) {
  const tasks = useQuery(api.internalAPI.tasks.getTasks) as Task[] | undefined;
  const createTestTask = useMutation(api.internalAPI.tasks.createTestTask);

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "subirReporteMovimientos":
        return <FileText className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getTaskTitle = (type: string) => {
    switch (type) {
      case "subirReporteMovimientos":
        return "Subir Reporte de Movimientos";
      default:
        return type;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const pendingTasks = tasks?.filter(task => !task.isCompleted) || [];
  const completedTasks = tasks?.filter(task => task.isCompleted) || [];

  return (
    <div className="w-80 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex-shrink-0">
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                Tareas Pendientes
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {pendingTasks.length} pendientes, {completedTasks.length} completadas
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => createTestTask()}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Test
            </Button>
          </div>
        </div>
        
        {/* Task List */}
        <div className="flex-1 overflow-y-auto">
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-orange-500" />
                Pendientes ({pendingTasks.length})
              </h3>
              <div className="space-y-2">
                {pendingTasks.map((task) => (
                  <button
                    key={task._id}
                    onClick={() => onTaskSelect(task)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border transition-colors",
                      selectedTaskId === task._id
                        ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                        : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 mt-0.5 text-gray-400">
                          {getTaskIcon(task.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {getTaskTitle(task.type)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatDate(task.createdAt)}
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

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                Completadas ({completedTasks.length})
              </h3>
              <div className="space-y-2">
                {completedTasks.slice(0, 5).map((task) => (
                  <div
                    key={task._id}
                    className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 opacity-75"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 mt-0.5 text-gray-400">
                          {getTaskIcon(task.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate line-through">
                            {getTaskTitle(task.type)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {formatDate(task.createdAt)}
                          </p>
                        </div>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {pendingTasks.length === 0 && completedTasks.length === 0 && (
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
      </div>
    </div>
  );
}
