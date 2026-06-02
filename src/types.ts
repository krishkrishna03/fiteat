export interface User {
  _id?: string
  name: string
  email: string
  isAdmin?: boolean
  subscriptionStatus?: 'ACTIVE' | 'INACTIVE' | 'EXPIRED'
  createdAt?: string
  phone?: string
  dob?: string
  location?: string
  address?: string
  age?: number
  weight?: number
  height?: number
  gender?: string
}
