import type { Product, User } from '../types'

export async function exportUsersByCompanyPdf(
  company: string,
  users: User[]
): Promise<void> {
  const { generateUsersByCompanyPdf } = await import('./pdf')
  return generateUsersByCompanyPdf(company, users)
}

export async function exportProductsByCategoryPdf(
  category: string,
  products: Product[]
): Promise<void> {
  const { generateProductsByCategoryPdf } = await import('./pdf')
  return generateProductsByCategoryPdf(category, products)
}

export async function exportAllProductsByCategoryPdf(
  products: Product[]
): Promise<void> {
  const { generateAllProductsByCategoryPdf } = await import('./pdf')
  return generateAllProductsByCategoryPdf(products)
}
