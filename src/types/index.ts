export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  company: { name: string }
}

export interface Product {
  id: number
  title: string
  description: string
  price: number
  stock: number
  category: string
  thumbnail: string
}

export interface PaginatedResponse {
  total: number
  skip: number
  limit: number
}

export interface UsersResponse extends PaginatedResponse {
  users: User[]
}

export interface ProductsResponse extends PaginatedResponse {
  products: Product[]
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  createdAt: Date
  read: boolean
  link?: string
}
