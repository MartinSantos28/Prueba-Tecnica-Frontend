import { getCategoryLabel } from '../utils/categories'

type CategoryChipProps = {
  category: string
  className?: string
}

export default function CategoryChip({ category, className = '' }: CategoryChipProps) {
  const slug = category.trim() || 'default'

  return (
    <span
      className={`category-chip category-chip--${slug}${className ? ` ${className}` : ''}`}
    >
      {getCategoryLabel(category)}
    </span>
  )
}
