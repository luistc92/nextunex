"use client"

import { useState } from "react"
import { Button } from "/components/ui/button"
import { Avatar, AvatarFallback } from "/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "/components/ui/dropdown-menu"
import { Receipt, Menu, User, LogOut, Settings, X } from "lucide-react"

interface NavbarProps {
  userName?: string
  onNewExpense: () => void
}

export default function Navbar({ userName = "Juan Pérez", onNewExpense }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 fixed top-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo - always on left */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Receipt className="h-6 w-6 text-blue-600" />
          </div>
          <span className="text-xl font-semibold text-gray-900">ExpenseApp</span>
        </div>

        {/* Right side - User and Menu */}
        <div className="flex items-center gap-2">
          {/* User Component */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-200 text-gray-700">
                    {userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:block">{userName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <User className="h-4 w-4 mr-2" />
                Mi Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Hamburger Menu - always on far right */}
          <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>

          {/* Full Screen Menu Overlay */}
          {isMenuOpen && (
            <div className="fixed inset-0 bg-white z-50 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Receipt className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-xl font-semibold text-gray-900">ExpenseApp</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Menu Content */}
              <div className="flex-1 p-6">
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      // Navigate to reembolsos (already on this page)
                    }}
                    className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Receipt className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Reembolsos</h3>
                      <p className="text-sm text-gray-600">Gestiona tus solicitudes de gastos</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
