import { useState } from "react";

const STORAGE_KEY = "ob_recently_viewed_v1";
const MAX_ITEMS = 8;

function loadAndRecord(currentId) {
  let ids;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    ids = raw ? JSON.parse(raw) : [];
  } catch {
    ids = [];
  }
  if (currentId) {
    ids = [currentId, ...ids.filter((id) => id !== currentId)].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }
  return ids;
}

// ObProductDetail remounts per product (keyed by slug in OtherBrandsSite),
// so this hook's lazy useState initializer runs exactly once per product
// view — no effect needed to "record" the view.
export default function useRecentlyViewed(currentId) {
  const [ids] = useState(() => loadAndRecord(currentId));
  return ids;
}
