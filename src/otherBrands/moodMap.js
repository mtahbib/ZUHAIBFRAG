// Editorial "mood" words used across the mood wall and the fragrance
// finder — mapped to the underlying fragrance-family data so either entry
// point drives the same product set.

export const MOODS = [
  { key: "FRESH", label: "Fresh", families: ["Fresh", "Aquatic", "Citrus"] },
  { key: "DARK", label: "Dark", families: ["Oud", "Woody"] },
  { key: "SEDUCTIVE", label: "Seductive", families: ["Oriental", "Gourmand"] },
  { key: "CLEAN", label: "Clean", families: ["Aquatic", "Fresh"] },
  { key: "WARM", label: "Warm", families: ["Gourmand", "Oriental", "Woody"] },
  { key: "MYSTERIOUS", label: "Mysterious", families: ["Oud", "Oriental"] },
];

export function moodByKey(key) {
  return MOODS.find((m) => m.key === key);
}

// Product `family` / `fragranceFamily` are compound freeform labels
// ("Fresh Woody", "Spicy Oud", "Oriental Spicy / Vanilla"), so match a mood
// when any of its family keywords appears anywhere in the product's scent
// descriptors — not by exact string equality.
export function productMatchesMood(product, moodKey) {
  const mood = moodByKey(moodKey);
  if (!mood) return true;
  const haystack = [product.family, product.fragranceFamily, ...(product.mainAccords || [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return mood.families.some((f) => haystack.includes(f.toLowerCase()));
}

export function productsForMood(products, moodKey) {
  const mood = moodByKey(moodKey);
  if (!mood) return products;
  return products.filter((p) => productMatchesMood(p, moodKey));
}
