export {}

// Create a type for the roles
export type Roles = 'general' | 'operador'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}