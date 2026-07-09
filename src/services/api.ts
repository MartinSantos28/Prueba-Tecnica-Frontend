/*
  Servicio API
  -------------
  Implementar por el candidato:

  La API de dummyjson soporta paginación con:
    GET /recurso?limit=N&skip=N
  Responde con: { datos: [], total, skip, limit }

  Funciones a implementar:

  - fetchUsers(page?: number, limit?: number): Promise<UsersResponse>
    GET /users?limit=N&skip=N
    Retorna UsersResponse (contiene users[], total, skip, limit)

  - fetchProducts(page?: number, limit?: number): Promise<ProductsResponse>
    GET /products?limit=N&skip=N
    Retorna ProductsResponse (contiene products[], total, skip, limit)

  - fetchProduct(id: number): Promise<Product>
    GET /products/:id
    Retorna un producto individual

  Tipos disponibles en src/types/index.ts:
  User, Product, UsersResponse, ProductsResponse
*/

export const BASE_URL = 'https://dummyjson.com'
