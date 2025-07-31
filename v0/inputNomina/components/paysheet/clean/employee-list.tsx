"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Employee } from "@/lib/data"
import { Search, UserCircle } from "lucide-react"

interface EmployeeListProps {
  employees: Employee[]
  selectedEmployee: Employee | null
  onSelectEmployee: (employee: Employee) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function EmployeeList({
  employees,
  selectedEmployee,
  onSelectEmployee,
  searchQuery,
  onSearchChange,
}: EmployeeListProps) {
  return (
    <aside className="w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold">Empleados</h2>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar empleados..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2 space-y-1">
          {employees.map((employee) => (
            <button
              key={employee.id}
              onClick={() => onSelectEmployee(employee)}
              className={cn(
                "w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                selectedEmployee?.id === employee.id
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900",
              )}
            >
              <UserCircle className="h-5 w-5" />
              <span>{employee.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )
}
