import type { Product, UsersResponse, ProductsResponse } from '../types'

export const BASE_URL = 'https://dummyjson.com'

type ProductCategoryResponse = {
  slug: string
  name: string
  url: string
}

function createCachedFetcher<T>(fetcher: () => Promise<T>) {
  let cache: T | null = null
  let inFlight: Promise<T> | null = null

  return (force = false): Promise<T> => {
    if (!force && cache) return Promise.resolve(cache)
    if (!force && inFlight) return inFlight

    inFlight = fetcher()
      .then((data) => {
        cache = data
        return data
      })
      .finally(() => {
        inFlight = null
      })

    return inFlight
  }
}

export class HttpError extends Error {
  status: number

  constructor(status: number, message?: string) {
    super(message ?? `Error HTTP: ${status}`)
    this.status = status
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new HttpError(response.status)
  }
  return response.json() as Promise<T>
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

export async function fetchProductCategories(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/products/categories`)
  const data = await handleResponse<ProductCategoryResponse[]>(response)
  return data.map((category) => category.slug)
}

export const fetchAllUsers = createCachedFetcher(async () => {
  const response = await fetch(`${BASE_URL}/users?limit=0`)
  const data = await handleResponse<UsersResponse>(response)
  return data.users
})

export const fetchAllProducts = createCachedFetcher(async () => {
  const response = await fetch(`${BASE_URL}/products?limit=0`)
  const data = await handleResponse<ProductsResponse>(response)
  return data.products
})

/** Alias descriptivo para obtener todo el catálogo en una sola petición. */
export const getAllProducts = fetchAllProducts
