"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { CutoffTicketCard } from "./cutoff-ticket-card"
import { AdditionalPayments } from "@/components/paysheet/additional-payments"
import { Discounts } from "@/components/paysheet/discounts"
import { finalizePaysheet, type PaysheetSubmission } from "@/actions/paysheet-actions"
import type { Employee } from "@/lib/data"
import { CheckCircle, Loader2 } from "lucide-react"

interface PaysheetDetailsProps {
  employee: Employee
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount)

export function PaysheetDetails({ employee }: PaysheetDetailsProps) {
  const [additionalPaymentsTotal, setAdditionalPaymentsTotal] = React.useState(0)
  const [additionalPayments, setAdditionalPayments] = React.useState<Array<{ description: string; amount: number }>>([])
  const [discountsTotal, setDiscountsTotal] = React.useState(0)
  const [discounts, setDiscounts] = React.useState<Array<{ description: string; amount: number }>>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { toast } = useToast()

  const cutoffTotal = employee.cutoffTickets.reduce((acc, ticket) => {
    const profit =
      ticket.sales.reduce((s, i) => s + i.amount, 0) -
      ticket.gas.reduce((g, i) => g + i.amount, 0) -
      ticket.tolls.reduce((t, i) => t + i.amount, 0)
    return acc + profit * (ticket.employeePercentage / 100)
  }, 0)

  const grandTotal = cutoffTotal + additionalPaymentsTotal - discountsTotal

  const handleFinalize = async () => {
    setIsSubmitting(true)

    try {
      const paysheetData: PaysheetSubmission = {
        employeeId: employee.id,
        employeeName: employee.name,
        cutoffTicketsTotal: cutoffTotal,
        additionalPaymentsTotal,
        additionalPayments,
        discountsTotal,
        discounts,
        grandTotal,
        submittedAt: new Date().toISOString(),
      }

      const result = await finalizePaysheet(paysheetData)

      if (result.success) {
        toast({
          title: "Nómina Finalizada",
          description: result.message,
          duration: 5000,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al finalizar la nómina. Por favor, inténtalo de nuevo.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Tabs defaultValue="tickets" className="flex-1 flex flex-col min-h-0">
        {/* Header integrado con navegación */}
        <header className="flex-shrink-0 p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div className="flex items-center justify-between">
            {/* Información del empleado */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">{employee.name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Nómina del período actual</p>
            </div>

            {/* Navegación moderna y compacta */}
            <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <TabsTrigger
                value="tickets"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100 px-4 py-2 text-sm font-medium rounded-md transition-all"
              >
                Tickets de Corte
              </TabsTrigger>
              <TabsTrigger
                value="payments"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100 px-4 py-2 text-sm font-medium rounded-md transition-all"
              >
                Pagos Adicionales
              </TabsTrigger>
              <TabsTrigger
                value="discounts"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100 px-4 py-2 text-sm font-medium rounded-md transition-all"
              >
                Descuentos
              </TabsTrigger>
            </TabsList>
          </div>
        </header>

        {/* Contenido directo sin separación adicional */}
        <div className="flex-1 overflow-y-auto p-6 hide-scrollbar bg-gray-50 dark:bg-black">
          <TabsContent value="tickets" className="mt-0">
            <div className="space-y-6">
              {employee.cutoffTickets.map((ticket) => (
                <CutoffTicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="payments" className="mt-0">
            <AdditionalPayments onTotalChange={setAdditionalPaymentsTotal} onItemsChange={setAdditionalPayments} />
          </TabsContent>
          <TabsContent value="discounts" className="mt-0">
            <Discounts onTotalChange={setDiscountsTotal} onItemsChange={setDiscounts} />
          </TabsContent>
        </div>

        <footer className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div className="max-w-full mx-auto">
            <div className="flex justify-between items-center gap-6">
              {/* Subtotales a la izquierda */}
              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Tickets: </span>
                  <span className="font-medium font-mono">{formatCurrency(cutoffTotal)}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Pagos: </span>
                  <span className="font-medium text-green-600 font-mono">
                    +{formatCurrency(additionalPaymentsTotal)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Desc: </span>
                  <span className="font-medium text-red-600 font-mono">-{formatCurrency(discountsTotal)}</span>
                </div>
              </div>

              {/* Total General en el centro */}
              <div className="flex-1 text-center">
                <span className="text-lg font-bold">Total: </span>
                <span className="text-lg font-bold text-green-600 dark:text-green-500 font-mono">
                  {formatCurrency(grandTotal)}
                </span>
              </div>

              {/* Botón a la derecha */}
              <div className="flex-shrink-0">
                <Button onClick={handleFinalize} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finalizando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Aceptar y Finalizar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </footer>
      </Tabs>
    </div>
  )
}
