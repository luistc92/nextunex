import { useState } from "react"
import { Button } from "/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Navbar from "./navbar"
import ExpenseList from "./expense-list"
import ExpenseReimbursementForm from "./expense-reimbursement-form"

interface ExpenseRequest {
  id: string
  category: string
  amount: number
  description: string
  status: "pending" | "approved" | "rejected"
  date: string
  comments?: string
}

export default function ExpenseDashboard() {
  const [currentView, setCurrentView] = useState<"list" | "form">("list")
  const [selectedExpense, setSelectedExpense] = useState<ExpenseRequest | null>(null)

  // Mock data - in real app this would come from API
  const [expenses] = useState<ExpenseRequest[]>([
    {
      id: "1",
      category: "fuel",
      amount: 45.5,
      description: "Gasolina para viaje a cliente en zona norte",
      status: "approved",
      date: "2024-01-15",
    },
    {
      id: "2",
      category: "meals",
      amount: 28.75,
      description: "Almuerzo con cliente potencial",
      status: "pending",
      date: "2024-01-14",
    },
    {
      id: "3",
      category: "maintenance",
      amount: 120.0,
      description: "Cambio de aceite y filtros del vehículo",
      status: "rejected",
      date: "2024-01-12",
      comments: "Por favor incluir más detalles sobre el propósito del gasto y verificar que el recibo sea legible.",
    },
    {
      id: "4",
      category: "tolls",
      amount: 15.25,
      description: "Peajes autopista durante entrega",
      status: "approved",
      date: "2024-01-10",
    },
  ])

  const handleExpenseClick = (expense: ExpenseRequest) => {
    setSelectedExpense(expense)
    setCurrentView("form")
  }

  const handleNewExpense = () => {
    setSelectedExpense(null)
    setCurrentView("form")
  }

  const handleBackToList = () => {
    setCurrentView("list")
    setSelectedExpense(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Navbar onNewExpense={handleNewExpense} />

      <div className="max-w-4xl mx-auto">
        {currentView === "list" ? (
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mis Gastos</h1>
                <p className="text-gray-600">Gestiona tus solicitudes de reembolso</p>
              </div>
              <Button onClick={handleNewExpense} className="bg-blue-600 hover:bg-blue-700">
                Nuevo Gasto
              </Button>
            </div>

            <ExpenseList expenses={expenses} onExpenseClick={handleExpenseClick} onNewExpense={handleNewExpense} />
          </div>
        ) : (
          <div>
            <div className="bg-white border-b border-gray-200 px-4 py-3">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={handleBackToList} className="p-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedExpense ? "Editar Gasto" : "Nuevo Gasto"}
                </h2>
              </div>
            </div>

            <ExpenseReimbursementForm initialData={selectedExpense} onBack={handleBackToList} />
          </div>
        )}
      </div>
    </div>
  )
}
