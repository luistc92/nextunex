"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "/components/ui/button"
import { Input } from "/components/ui/input"
import { Label } from "/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "/components/ui/select"
import { Textarea } from "/components/ui/textarea"
import { Badge } from "/components/ui/badge"
import { Receipt, FileText, AlertCircle, CheckCircle, Clock, Camera } from "lucide-react"

interface ExpenseRequest {
  id: string
  category: string
  amount: number
  description: string
  status: "pending" | "approved" | "rejected"
  date: string
  comments?: string
}

interface ExpenseReimbursementFormProps {
  initialData?: ExpenseRequest | null
  onBack?: () => void
}

export default function ExpenseReimbursementForm({ initialData, onBack }: ExpenseReimbursementFormProps) {
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [receipt, setReceipt] = useState<File | null>(null)
  const [evidence, setEvidence] = useState<File | null>(null)
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState<string | null>(null)
  const [evidencePreviewUrl, setEvidencePreviewUrl] = useState<string | null>(null)

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setCategory(initialData.category)
      setAmount(initialData.amount.toString())
      setDescription(initialData.description)
    }
  }, [initialData])

  const handleReceiptUpload = (file: File | null) => {
    setReceipt(file)

    // Clear previous preview
    if (receiptPreviewUrl) {
      URL.revokeObjectURL(receiptPreviewUrl)
    }

    // Create preview URL for images
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file)
      setReceiptPreviewUrl(url)
    } else {
      setReceiptPreviewUrl(null)
    }
  }

  const handleEvidenceUpload = (file: File | null) => {
    setEvidence(file)

    // Clear previous preview
    if (evidencePreviewUrl) {
      URL.revokeObjectURL(evidencePreviewUrl)
    }

    // Create preview URL for images
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file)
      setEvidencePreviewUrl(url)
    } else {
      setEvidencePreviewUrl(null)
    }
  }

  const removeReceipt = () => {
    if (receiptPreviewUrl) {
      URL.revokeObjectURL(receiptPreviewUrl)
    }
    setReceipt(null)
    setReceiptPreviewUrl(null)
  }

  const removeEvidence = () => {
    if (evidencePreviewUrl) {
      URL.revokeObjectURL(evidencePreviewUrl)
    }
    setEvidence(null)
    setEvidencePreviewUrl(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    const expenseData = {
      category,
      amount: Number.parseFloat(amount),
      description,
      receipt,
      evidence,
    }
    console.log("Formulario enviado con gasto:", expenseData)

    // After successful submission, go back to list
    if (onBack) {
      onBack()
    }
  }

  const getStatusIcon = () => {
    if (!initialData) return null

    switch (initialData.status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return null
    }
  }

  const getStatusBadge = () => {
    if (!initialData) return null

    switch (initialData.status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">Aprobado</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs">Rechazado</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs">Pendiente</Badge>
      default:
        return null
    }
  }

  const FileUploadSection = ({
    label,
    file,
    previewUrl,
    onFileUpload,
    onRemove,
    uploadId,
    replaceId,
    icon: Icon,
  }: {
    label: string
    file: File | null
    previewUrl: string | null
    onFileUpload: (file: File | null) => void
    onRemove: () => void
    uploadId: string
    replaceId: string
    icon: React.ElementType
  }) => {
    const isImage = file && file.type.startsWith("image/")
    const isPDF = file && file.type === "application/pdf"

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>

        {!file ? (
          <div className="w-full">
            <Input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => onFileUpload(e.target.files?.[0] || null)}
              className="hidden"
              id={uploadId}
            />
            <Label
              htmlFor={uploadId}
              className="flex flex-col items-center justify-center gap-2 w-full h-24 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Icon className="h-6 w-6 text-gray-400" />
              <span className="text-sm text-gray-600 text-center font-medium">Subir {label}</span>
            </Label>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Preview */}
            {isImage && previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt={label}
                  className="w-full h-24 object-cover rounded-lg border bg-white"
                />
              </div>
            ) : isPDF ? (
              <div className="w-full h-24 flex flex-col items-center justify-center bg-blue-50 rounded-lg border">
                <FileText className="h-8 w-8 text-blue-600" />
                <span className="text-sm text-blue-600 mt-1 font-medium">PDF</span>
              </div>
            ) : null}

            {/* File Actions */}
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => onFileUpload(e.target.files?.[0] || null)}
                className="hidden"
                id={replaceId}
              />
              <Label
                htmlFor={replaceId}
                className="flex-1 flex items-center justify-center h-10 px-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium cursor-pointer hover:bg-blue-100 transition-colors"
              >
                Cambiar
              </Label>
              <Button
                type="button"
                onClick={onRemove}
                variant="outline"
                size="sm"
                className="flex-1 h-10 px-3 bg-red-50 text-red-700 border-red-200 hover:bg-red-100 text-sm font-medium"
              >
                Eliminar
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-md mx-auto">
        {/* Header - Always show title, subtitle and logo */}
        <div className="bg-white px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Receipt className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">Reembolso de Gastos</h1>
              <p className="text-sm text-gray-600">
                {initialData ? "Edita tu gasto para reembolso" : "Envía tu gasto para reembolso"}
              </p>
            </div>
          </div>

          {/* Status Section - Only show when editing */}
          {initialData && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                {getStatusBadge()}
              </div>

              {initialData.comments && (initialData.status === "rejected" || initialData.status === "pending") && (
                <div
                  className={`rounded-lg p-3 ${
                    initialData.status === "rejected"
                      ? "bg-red-50 border border-red-200"
                      : "bg-yellow-50 border border-yellow-200"
                  }`}
                >
                  <p
                    className={`text-sm font-medium mb-2 ${initialData.status === "rejected" ? "text-red-700" : "text-yellow-700"}`}
                  >
                    Comentarios:
                  </p>
                  <p
                    className={`text-sm leading-relaxed ${initialData.status === "rejected" ? "text-red-600" : "text-yellow-600"}`}
                  >
                    {initialData.comments}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Form Content */}
        <div className="p-4 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Categoría</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fuel">Combustible</SelectItem>
                  <SelectItem value="maintenance">Mantenimiento</SelectItem>
                  <SelectItem value="tolls">Peajes y Estacionamiento</SelectItem>
                  <SelectItem value="meals">Comidas</SelectItem>
                  <SelectItem value="accommodation">Alojamiento</SelectItem>
                  <SelectItem value="supplies">Suministros</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Monto ($)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-12 text-base"
              />
            </div>

            {/* File Uploads */}
            <div className="space-y-4">
              <FileUploadSection
                label="Ticket"
                file={receipt}
                previewUrl={receiptPreviewUrl}
                onFileUpload={handleReceiptUpload}
                onRemove={removeReceipt}
                uploadId="receipt-upload"
                replaceId="receipt-replace"
                icon={Receipt}
              />

              <FileUploadSection
                label="Evidencias"
                file={evidence}
                previewUrl={evidencePreviewUrl}
                onFileUpload={handleEvidenceUpload}
                onRemove={removeEvidence}
                uploadId="evidence-upload"
                replaceId="evidence-replace"
                icon={Camera}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Descripción</Label>
              <Textarea
                placeholder="Describe los detalles del gasto..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="resize-none text-base"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button type="submit" className="w-full h-12 text-base font-medium">
                {initialData?.status === "rejected"
                  ? "Reenviar Solicitud"
                  : initialData
                    ? "Actualizar Gasto"
                    : "Enviar Solicitud"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
