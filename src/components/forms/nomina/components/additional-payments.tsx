"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Trash2, Check, X, Edit } from "lucide-react"
import "./paysheet.css"

interface PaymentItem {
  id: number
  description: string
  amount: number
}

interface AdditionalPaymentsProps {
  onTotalChange: (total: number) => void
  onItemsChange?: (items: Array<{ description: string; amount: number }>) => void
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount)

export function AdditionalPayments({ onTotalChange, onItemsChange }: AdditionalPaymentsProps) {
  const [items, setItems] = React.useState<PaymentItem[]>([])
  const [isAdding, setIsAdding] = React.useState(false)
  const [editingId, setEditingId] = React.useState<number | null>(null)
  const [description, setDescription] = React.useState("")
  const [amount, setAmount] = React.useState("")
  const [editDescription, setEditDescription] = React.useState("")
  const [editAmount, setEditAmount] = React.useState("")
  const descriptionInputRef = React.useRef<HTMLInputElement>(null)
  const editDescriptionRef = React.useRef<HTMLInputElement>(null)
  const editAmountRef = React.useRef<HTMLInputElement>(null)

  const total = React.useMemo(() => items.reduce((acc, item) => acc + item.amount, 0), [items])

  React.useEffect(() => {
    onTotalChange(total)
    onItemsChange?.(items.map(({ id, ...rest }) => rest))
  }, [total, items, onTotalChange, onItemsChange])

  const handleStartAdding = () => {
    setIsAdding(true)
    setEditingId(null)
    setTimeout(() => descriptionInputRef.current?.focus(), 0)
  }

  const handleAddItem = () => {
    const numAmount = Number.parseFloat(amount)
    if (description && !isNaN(numAmount) && numAmount > 0) {
      setItems([...items, { id: Date.now(), description, amount: numAmount }])
      setDescription("")
      setAmount("")
      setIsAdding(false)
    }
  }

  const handleCancelAdd = () => {
    setDescription("")
    setAmount("")
    setIsAdding(false)
  }

  const handleEditDescription = (item: PaymentItem) => {
    setEditingId(item.id)
    setEditDescription(item.description)
    setEditAmount(item.amount.toString())
    setIsAdding(false)
    setTimeout(() => editDescriptionRef.current?.focus(), 0)
  }

  const handleEditAmount = (item: PaymentItem) => {
    setEditingId(item.id)
    setEditDescription(item.description)
    setEditAmount(item.amount.toString())
    setIsAdding(false)
    setTimeout(() => editAmountRef.current?.focus(), 0)
  }

  const handleSaveEdit = () => {
    const numAmount = Number.parseFloat(editAmount)
    if (editDescription && !isNaN(numAmount) && numAmount > 0 && editingId) {
      setItems(
        items.map((item) =>
          item.id === editingId ? { ...item, description: editDescription, amount: numAmount } : item,
        ),
      )
      setEditingId(null)
      setEditDescription("")
      setEditAmount("")
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditDescription("")
    setEditAmount("")
  }

  const handleRemoveItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
    if (editingId === id) {
      setEditingId(null)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
      {/* Header con total integrado */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Pagos Adicionales</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Agrega bonos, comisiones u otros pagos.</p>
          </div>
          {items.length > 0 && (
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
              <div className="text-xl font-bold font-mono text-green-600 dark:text-green-500 tabular-nums">
                {formatCurrency(total)}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-right w-32">Cantidad</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Filas de items existentes */}
            {items.map((item) => (
              <TableRow key={item.id} className="group">
                <TableCell className="font-medium">
                  {editingId === item.id ? (
                    <input
                      ref={editDescriptionRef}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="paysheet-seamless-input w-full font-medium"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit()
                        if (e.key === "Escape") handleCancelEdit()
                      }}
                    />
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 -m-2 rounded"
                      onClick={() => handleEditDescription(item)}
                    >
                      {item.description}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right font-mono text-green-600 dark:text-green-500 tabular-nums">
                  {editingId === item.id ? (
                    <input
                      ref={editAmountRef}
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      min="0"
                      step="0.01"
                      className="paysheet-seamless-input w-full text-right font-mono tabular-nums text-green-600 dark:text-green-500"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit()
                        if (e.key === "Escape") handleCancelEdit()
                      }}
                    />
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 -m-2 rounded"
                      onClick={() => handleEditAmount(item)}
                    >
                      {formatCurrency(item.amount)}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleSaveEdit}
                        disabled={!editDescription || !editAmount}
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCancelEdit}>
                        <X className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleEditDescription(item)}
                      >
                        <Edit className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {/* Fila de formulario cuando está agregando */}
            {isAdding && (
              <TableRow className="bg-blue-50 dark:bg-blue-950/20">
                <TableCell>
                  <input
                    ref={descriptionInputRef}
                    placeholder="Descripción (ej. Bono de productividad)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="paysheet-seamless-input w-full font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddItem()
                      if (e.key === "Escape") handleCancelAdd()
                    }}
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    step="0.01"
                    className="paysheet-seamless-input w-full text-right font-mono tabular-nums placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddItem()
                      if (e.key === "Escape") handleCancelAdd()
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleAddItem}
                      disabled={!description || !amount}
                    >
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCancelAdd}>
                      <X className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* Mensaje cuando no hay items */}
            {items.length === 0 && !isAdding && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No hay pagos adicionales.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Botón para agregar */}
      {!isAdding && (
        <div className="px-6 pb-6">
          <div className="flex justify-end">
            <button
              onClick={handleStartAdding}
              className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <PlusCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
