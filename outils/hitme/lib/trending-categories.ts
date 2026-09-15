export interface TrendingCategory {
  id: string
  label: string
  // Either a native YouTube videoCategoryId...
  ytCategoryId?: string
  // ...or a synthetic keyword query (for categories YouTube doesn't expose
  // natively, like "Fitness" or "AI").
  synthetic?: { query: string }
}

export const TRENDING_CATEGORIES: TrendingCategory[] = [
  { id: "sports", label: "Sports", ytCategoryId: "17" },
  { id: "fitness", label: "Fitness", synthetic: { query: "fitness workout training" } },
  { id: "gaming", label: "Gaming", ytCategoryId: "20" },
  { id: "music", label: "Music", ytCategoryId: "10" },
  { id: "education", label: "Education", ytCategoryId: "27" },
  { id: "howto", label: "Howto & Style", ytCategoryId: "26" },
  { id: "science", label: "Science & Tech", ytCategoryId: "28" },
  { id: "entertainment", label: "Entertainment", ytCategoryId: "24" },
  { id: "news", label: "News & Politics", ytCategoryId: "25" },
  { id: "comedy", label: "Comedy", ytCategoryId: "23" },
  { id: "people", label: "People & Blogs", ytCategoryId: "22" },
  { id: "travel", label: "Travel & Events", ytCategoryId: "19" },
  { id: "film", label: "Film & Animation", ytCategoryId: "1" },
  { id: "autos", label: "Autos & Vehicles", ytCategoryId: "2" },
  { id: "ai", label: "AI", synthetic: { query: "AI artificial intelligence" } },
  { id: "cooking", label: "Cooking", synthetic: { query: "cooking recipe food" } },
]

export const TRENDING_REGIONS: { code: string; label: string }[] = [
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
  { code: "ES", label: "Spain" },
  { code: "IT", label: "Italy" },
  { code: "NL", label: "Netherlands" },
  { code: "BR", label: "Brazil" },
  { code: "MX", label: "Mexico" },
  { code: "JP", label: "Japan" },
  { code: "KR", label: "South Korea" },
  { code: "IN", label: "India" },
  { code: "ID", label: "Indonesia" },
  { code: "TR", label: "Turkey" },
  { code: "AE", label: "United Arab Emirates" },
]

export function findCategory(id: string): TrendingCategory | undefined {
  return TRENDING_CATEGORIES.find((c) => c.id === id)
}
