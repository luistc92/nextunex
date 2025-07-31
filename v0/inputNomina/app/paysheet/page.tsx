"use client"

import * as React from "react"
import { EmployeeList } from "@/components/paysheet/clean/employee-list"
import { PaysheetDetails } from "@/components/paysheet/clean/paysheet-details"
import { type Employee, employees as allEmployees } from "@/lib/data"

export default function CleanPaysheetPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(allEmployees[0] || null)

  const filteredEmployees = allEmployees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="h-screen w-full bg-gray-50 dark:bg-black flex overflow-hidden">
      <EmployeeList
        employees={filteredEmployees}
        selectedEmployee={selectedEmployee}
        onSelectEmployee={setSelectedEmployee}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        {selectedEmployee ? (
          <PaysheetDetails employee={selectedEmployee} key={selectedEmployee.id} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Ningún Empleado Seleccionado</h2>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {filteredEmployees.length > 0
                  ? "Selecciona un empleado de la lista para ver su nómina."
                  : "No hay empleados que coincidan con tu búsqueda."}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
