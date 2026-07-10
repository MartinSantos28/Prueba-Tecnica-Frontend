export const CATEGORY_LABELS: Record<string, string> = {
  beauty: 'Belleza',
  fragrances: 'Fragancias',
  furniture: 'Muebles',
  groceries: 'Abarrotes',
  'home-decoration': 'Decoración del hogar',
  'kitchen-accessories': 'Accesorios de cocina',
  laptops: 'Portátiles',
  'mens-shirts': 'Camisas de hombre',
  'mens-shoes': 'Zapatos de hombre',
  'mens-watches': 'Relojes de hombre',
  'mobile-accessories': 'Accesorios móviles',
  motorcycle: 'Motocicletas',
  'skin-care': 'Cuidado de la piel',
  smartphones: 'Smartphones',
  'sports-accessories': 'Accesorios deportivos',
  sunglasses: 'Gafas de sol',
  tablets: 'Tablets',
  tops: 'Blusas y tops',
  vehicle: 'Vehículos',
  'womens-bags': 'Bolsos de mujer',
  'womens-dresses': 'Vestidos de mujer',
  'womens-jewellery': 'Joyería de mujer',
  'womens-shoes': 'Zapatos de mujer',
  'womens-watches': 'Relojes de mujer',
}

export function getCategoryLabel(slug: string): string {
  return (
    CATEGORY_LABELS[slug] ??
    slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  )
}

export function sortCategoriesByLabel(categories: string[]): string[] {
  return [...categories].sort((a, b) =>
    getCategoryLabel(a).localeCompare(getCategoryLabel(b), 'es')
  )
}
