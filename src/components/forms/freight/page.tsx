"use client";

import { TruckList } from "./_components/TruckList";

// Mock data for trucks
const trucks = [
  { id: "truck-001", name: "Unidad 001", driver: "Juan Pérez", status: "available" as const },
  { id: "truck-002", name: "Unidad 002", driver: "María García", status: "in-transit" as const },
  { id: "truck-003", name: "Unidad 003", driver: "Carlos López", status: "available" as const },
  { id: "truck-004", name: "Unidad 004", driver: "Ana Martínez", status: "maintenance" as const },
  { id: "truck-005", name: "Unidad 005", driver: "Luis Rodríguez", status: "available" as const },
  { id: "truck-006", name: "Unidad 006", driver: "Elena Sánchez", status: "in-transit" as const },
  { id: "truck-007", name: "Unidad 007", driver: "Miguel Torres", status: "available" as const },
  { id: "truck-008", name: "Unidad 008", driver: "Carmen Ruiz", status: "available" as const },
  { id: "truck-009", name: "Unidad 009", driver: "Roberto Díaz", status: "in-transit" as const },
  { id: "truck-010", name: "Unidad 010", driver: "Patricia Morales", status: "available" as const },
  { id: "truck-011", name: "Unidad 011", driver: "Fernando Castro", status: "available" as const },
  { id: "truck-012", name: "Unidad 012", driver: "Isabel Herrera", status: "maintenance" as const },
  { id: "truck-013", name: "Unidad 013", driver: "Andrés Jiménez", status: "available" as const },
  { id: "truck-014", name: "Unidad 014", driver: "Lucía Vargas", status: "in-transit" as const },
  { id: "truck-015", name: "Unidad 015", driver: "Diego Romero", status: "available" as const },
  { id: "truck-016", name: "Unidad 016", driver: "Sofía Mendoza", status: "available" as const },
  { id: "truck-017", name: "Unidad 017", driver: "Javier Ortega", status: "available" as const },
  { id: "truck-018", name: "Unidad 018", driver: "Valentina Cruz", status: "in-transit" as const },
];

export default function FreightPage() {
  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        {/* Truck List */}
        <TruckList trucks={trucks} />
      </div>
    </div>
  );
}
