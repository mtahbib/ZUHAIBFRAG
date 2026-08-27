const fs = require('fs');
const file = 'src/components/Parvej.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace handleAdd logic
content = content.replace(
  `  const handleAdd = (e) => {
    e.stopPropagation();
    if (product.soldOut || added) return;
    onAddToCart({
      ...product,
      selectedSize: "100ml",
      cartKey: \`\${product.id}-100ml\`,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };`,
  `  const hasDecants = product.decants && product.decants.length > 0;
  const displaySize = hasDecants ? product.decants[0].size : "100ml";
  const displayPrice = hasDecants ? product.decants[0].price : product.price;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (product.soldOut || added) return;
    onAddToCart({
      ...product,
      selectedSize: displaySize,
      cartKey: \`\${product.id}-\${displaySize}\`,
      price: hasDecants ? parseInt(String(displayPrice).replace(/[^0-9]/g, '')) : product.price, // ensure price is passed correctly to cart
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };`
);

// Replace name logic
content = content.replace(
  `        <div style={{
          color: "#fff", fontSize: "11px", fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400, marginBottom: "2px",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{product.name}</div>`,
  `        <div style={{
          color: "#fff", fontSize: "11px", fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400, marginBottom: "2px",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{product.name} {displaySize}</div>`
);

// Replace price logic
content = content.replace(
  `        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: accent, fontSize: "13px", fontFamily: "'Cormorant Garamond', serif" }}>
            {product.price}
          </span>`,
  `        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: accent, fontSize: "13px", fontFamily: "'Cormorant Garamond', serif" }}>
            {displayPrice}
          </span>`
);

fs.writeFileSync(file, content);
