import { Badge } from "/components/ui/badge"
import { Button } from "/components/ui/button"
import { Card, CardContent } from "/components/ui/card"
import { Receipt, Calendar, MessageSquare, Plus } from "lucide-react"

interface ExpenseRequest {
  id: string
  category: string
  amount: number
  description: string
  status: "pending" | "approved" | "rejected"
  date: string
  comments?: string
}

interface ExpenseListProps {
  expenses: ExpenseRequest[]
  onExpenseClick: (expense: ExpenseRequest) => void
  onNewExpense: () => void
}

export default function ExpenseList({ expenses, onExpenseClick, onNewExpense }: ExpenseListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Aprobado</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rechazado</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendiente</Badge>
      default:
        return null
    }
  }

  const getCategoryName = (category: string) => {
    const categories: { [key: string]: string } = {
      fuel: "Combustible",
      maintenance: "Mantenimiento",
      tolls: "Peajes y Estacionamiento",
      meals: "Comidas",
      accommodation: "Alojamiento",
      supplies: "Suministros",
      other: "Otro",
    }
    return categories[category] || category
  }

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="p-4 bg-gray-100 rounded-full mb-4">
          <Receipt className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay gastos registrados</h3>
        <p className="text-gray-600 text-center mb-6">Comienza creando tu primera solicitud de reembolso</p>
        <Button onClick={onNewExpense} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Crear Primer Gasto
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <Card
          key={expense.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onExpenseClick(expense)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Receipt className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{getCategoryName(expense.category)}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Calendar className="h-4 w-4" />
                    {expense.date}
                  </div>
                </div>
              </div>
              {getStatusBadge(expense.status)}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg text-gray-900">${expense.amount.toFixed(2)}</span>
              </div>

              {expense.comments && expense.status === "rejected" && (
                <div className="flex items-center gap-1 text-red-600">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs">Comentarios</span>
                </div>
              )}
            </div>

            {expense.description && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{expense.description}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
