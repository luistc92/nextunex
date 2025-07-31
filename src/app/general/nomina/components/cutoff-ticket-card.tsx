"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { ChevronRight, ChevronDown } from "lucide-react"
import type { CutoffTicket } from "@/lib/data"
import "./paysheet.css"

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount)

interface SectionProps {
  title: string
  total: number
  items?: Array<{ description: string; amount: number }>
  isExpense?: boolean
  isTotal?: boolean
}

function Section({ title, total, items = [], isExpense = false, isTotal = false }: SectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const hasItems = items.length > 0

  return (
    <div className="space-y-2">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {/* Header con flecha, título y total en 3 columnas */}
        <div className="grid grid-cols-[40px_1fr_auto] gap-3 items-center py-2">
          <div className="flex justify-center">
            {hasItems && (
              <CollapsibleTrigger asChild>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </CollapsibleTrigger>
            )}
          </div>
          <h4
            className={`font-semibold text-base ${
              isTotal
                ? "text-gray-900 dark:text-gray-100"
                : isExpense
                  ? "text-red-700 dark:text-red-400"
                  : "text-green-700 dark:text-green-400"
            }`}
          >
            {title}
          </h4>
          <div
            className={`font-bold text-base font-mono text-right ${
              isTotal ? (total >= 0 ? "text-green-600" : "text-red-600") : isExpense ? "text-red-600" : "text-green-600"
            }`}
          >
            {isExpense && !isTotal ? `-${formatCurrency(total)}` : formatCurrency(total)}
          </div>
        </div>

        {/* Detalles expandibles */}
        {hasItems && (
          <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
            <div className="ml-10 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-[1fr_auto] gap-3 items-center text-sm py-1">
                  <span className="text-gray-600 dark:text-gray-400">{item.description}</span>
                  <span
                    className={`font-mono text-right ${isExpense ? "text-red-500" : "text-gray-800 dark:text-gray-200"}`}
                  >
                    {isExpense ? `-${formatCurrency(item.amount)}` : formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  )
}

export function CutoffTicketCard({ ticket }: { ticket: CutoffTicket }) {
  const [isOpen, setIsOpen] = useState(false)

  const totalSales = ticket.sales.reduce((acc, item) => acc + item.amount, 0)
  const totalGas = ticket.gas.reduce((acc, item) => acc + item.amount, 0)
  const totalTolls = ticket.tolls.reduce((acc, item) => acc + item.amount, 0)
  const totalFixedCosts = ticket.fixedCosts?.reduce((acc, item) => acc + item.amount, 0) || 0
  const totalExpenses = totalGas + totalTolls + totalFixedCosts
  const profit = totalSales - totalExpenses
  const employeeShare = profit * (ticket.employeePercentage / 100)

  return (
    <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-950 overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all duration-200 select-none">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-semibold">Ticket de Corte</CardTitle>
                <CardDescription>{ticket.period}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Parte del Empleado ({ticket.employeePercentage}%)</div>
                <div
                  className={`font-bold text-xl font-mono text-right ${employeeShare >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatCurrency(employeeShare)}
                </div>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
          <CardContent className="pt-0 pb-6">
            <Separator className="mb-6" />

            <div className="space-y-4">
              {/* Sección de Ingresos */}
              <Section title="Ingresos" total={totalSales} items={ticket.sales} />

              {/* Sección de Diesel */}
              <Section title="Diesel" total={totalGas} items={ticket.gas} isExpense={true} />

              {/* Sección de Casetas */}
              <Section title="Casetas" total={totalTolls} items={ticket.tolls} isExpense={true} />

              {/* Sección de Costos Fijos */}
              {ticket.fixedCosts && ticket.fixedCosts.length > 0 && (
                <Section title="Costos Fijos" total={totalFixedCosts} items={ticket.fixedCosts} isExpense={true} />
              )}

              {/* Separador antes del total */}
              <Separator className="my-4" />

              {/* Sección de Total */}
              <Section title="Total" total={profit} isTotal={true} />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
