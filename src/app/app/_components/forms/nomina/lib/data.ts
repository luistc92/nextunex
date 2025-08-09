export interface SaleItem {
  description: string
  amount: number
}

export interface GasTicket {
  description: string
  amount: number
}

export interface Toll {
  description: string
  amount: number
}

export interface FixedCost {
  description: string
  amount: number
}

export interface CutoffTicket {
  id: string
  period: string
  sales: SaleItem[]
  gas: GasTicket[]
  tolls: Toll[]
  fixedCosts?: FixedCost[]
  employeePercentage: number
}

export interface Employee {
  id: string
  name: string
  cutoffTickets: CutoffTicket[]
}

export const employees: Employee[] = [
  {
    id: "emp-001",
    name: "Juan Pérez",
    cutoffTickets: [
      {
        id: "cut-001a",
        period: "1 de Julio, 2025 - 15 de Julio, 2025",
        sales: [
          { description: "Viaje a Barcelona", amount: 1200 },
          { description: "Entrega Local", amount: 350 },
        ],
        gas: [
          { description: "Carga de Combustible #1", amount: 85.5 },
          { description: "Carga de Combustible #2", amount: 92.75 },
        ],
        tolls: [
          { description: "Peaje Autopista A-2", amount: 9.75 },
          { description: "Peaje Túnel", amount: 7.0 },
        ],
        fixedCosts: [
          { description: "Seguro del Vehículo", amount: 45.0 },
          { description: "Mantenimiento", amount: 25.0 },
        ],
        employeePercentage: 30,
      },
      {
        id: "cut-001b",
        period: "16 de Julio, 2025 - 31 de Julio, 2025",
        sales: [
          { description: "Viaje a Valencia", amount: 1800 },
          { description: "Carga Especial", amount: 500 },
        ],
        gas: [
          { description: "Carga de Combustible #3", amount: 110.2 },
          { description: "Carga de Combustible #4", amount: 105.0 },
        ],
        tolls: [{ description: "Peaje Autopista A-3", amount: 15.5 }],
        fixedCosts: [{ description: "Seguro del Vehículo", amount: 45.0 }],
        employeePercentage: 30,
      },
    ],
  },
  {
    id: "emp-002",
    name: "María García",
    cutoffTickets: [
      {
        id: "cut-002a",
        period: "1 de Julio, 2025 - 15 de Julio, 2025",
        sales: [{ description: "Ruta Norte", amount: 2500 }],
        gas: [
          { description: "Carga de Combustible #1", amount: 150.0 },
          { description: "Carga de Combustible #2", amount: 145.8 },
          { description: "Carga de Combustible #3", amount: 155.2 },
        ],
        tolls: [
          { description: "Peaje Autopista A-1", amount: 19.5 },
          { description: "Peaje Puente", amount: 5.0 },
        ],
        fixedCosts: [
          { description: "Seguro del Vehículo", amount: 50.0 },
          { description: "Revisión Técnica", amount: 30.0 },
        ],
        employeePercentage: 35,
      },
    ],
  },
  {
    id: "emp-003",
    name: "Carlos López",
    cutoffTickets: [
      {
        id: "cut-003a",
        period: "1 de Julio, 2025 - 15 de Julio, 2025",
        sales: [
          { description: "Ruta Centro", amount: 2100 },
          { description: "Entrega Urgente", amount: 600 },
        ],
        gas: [
          { description: "Combustible en Madrid", amount: 120.0 },
          { description: "Combustible en Toledo", amount: 115.0 },
        ],
        tolls: [{ description: "Peaje M-40", amount: 5.6 }],
        fixedCosts: [{ description: "Seguro del Vehículo", amount: 45.0 }],
        employeePercentage: 28,
      },
    ],
  },
]
