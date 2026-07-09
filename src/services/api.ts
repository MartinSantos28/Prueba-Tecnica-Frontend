import type { User, Product, UsersResponse, ProductsResponse } from '../types'

export const BASE_URL = 'https://dummyjson.com'

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error('Error HTTP: ${response.status} ')
  }
  return response.json() as Promise<T>;
}


export async function fetchUsers(
  page = 1,
  limit = 10
): Promise<UsersResponse> {
  const skip = (page - 1) * limit
  const response = await fetch(`${BASE_URL}/users?limit=${limit}&skip=${skip}`)
  return handleResponse<UsersResponse>(response)
}

export async function fetchProducts(
  page = 1,
  limit = 10
): Promise<ProductsResponse> {
  const skip = (page - 1) * limit
  const response = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`)
  return handleResponse<ProductsResponse>(response)
}

export async function fetchProduct(id: number): Promise<Product> {
  const response = await fetch(`${BASE_URL}/products/${id}`)
  return handleResponse<Product>(response)
}

export async function fetchAllUsers(): Promise<User[]> {
  const first = await fetchUsers(1, 100)
  if (first.total <= first.users.length) return first.users

  const pages = Math.ceil(first.total / 100)
  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, i) => fetchUsers(i + 2, 100))
  )
  return [...first.users, ...rest.flatMap((r) => r.users)]
}



export async function fetchAllProducts(): Promise<Product[]> {
  const first = await fetchProducts(1, 100)
  if (first.total <= first.products.length) return first.products

  const pages = Math.ceil(first.total / 100)
  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, i) => fetchProducts(i + 2, 100))
  )
  return [...first.products, ...rest.flatMap((r) => r.products)]
}