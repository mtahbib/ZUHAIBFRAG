export const WHATSAPP_NUMBER = "8801790221253";

export function buildOrderText(items, total) {
  const lines = items.map(
    (i) => `• ${i.brand} — ${i.name} (${i.size}) x${i.qty} — ৳${i.price * i.qty}`
  );
  return [
    "Hi Zuhaib Fragrance! I'd like to order (Other Brands):",
    "",
    ...lines,
    "",
    `Total: ৳${total}`,
  ].join("\n");
}

export function openWhatsAppOrder(items, total) {
  const msg = encodeURIComponent(buildOrderText(items, total));
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
}

// "You may also like" — scores by shared brand, family, overlapping notes,
// and closeness in starting price. Simple heuristic standing in for a real
// recommendations service.
export function getRecommendations(product, allProducts, limit = 4) {
  const productNotes = new Set([...(product.topNotes||[]), ...(product.heartNotes||[]), ...(product.baseNotes||[])]);

  return allProducts
    .filter((p) => p.id !== product.id)
    .map((p) => {
      const notes = [...(p.topNotes||[]), ...(p.heartNotes||[]), ...(p.baseNotes||[])];
      const sharedNotes = notes.filter((n) => productNotes.has(n)).length;
      const priceDiff = Math.abs(p.startingPrice - product.startingPrice);
      const score =
        (p.brand === product.brand ? 2 : 0) +
        (p.family === product.family ? 2 : 0) +
        sharedNotes * 1.2 +
        Math.max(0, 1 - priceDiff / 400);
      return { product: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.product);
}
