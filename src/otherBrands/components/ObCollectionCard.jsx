import { useState } from "react";
import { Link } from "react-router-dom";
import { useObCart } from "../context/ObCartContext";
import { useWishlist } from "../context/WishlistContext";
import { SIZE_ORDER } from "../theme";

export default function ObCollectionCard({ product }) {
  const sizes = SIZE_ORDER.filter((size) => product.sizes[size] != null);
  const [size, setSize] = useState(sizes[0]);
  const { addItem } = useObCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const saved = isWishlisted(product.id);
  const url = `/other-brands/product/${product.slug}`;

  return (
    <article className="ob-collection-card">
      <div className="ob-card-visual">
        <Link to={url} className="ob-card-image-link" aria-label={`Discover ${product.name}`}>
          <img className="ob-card-image" src={product.image || "/bottle.png"} alt={`${product.brand} ${product.name}`} loading="lazy" decoding="async" />
          <span className="ob-card-explore">Discover the fragrance <span aria-hidden="true">↗</span></span>
        </Link>
        {(!product.inStock || product.bestseller || product.newArrival) && <span className="ob-card-badge">{!product.inStock ? "Sold out" : product.newArrival ? "New discovery" : "Cult favourite"}</span>}
        <button className="ob-card-wishlist" onClick={() => toggleWishlist(product.id)} aria-pressed={saved} aria-label={`${saved ? "Remove" : "Save"} ${product.name} ${saved ? "from" : "to"} wishlist`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" /></svg>
        </button>
      </div>
      <div className="ob-card-info">
        <span className="ob-card-brand">{product.brand}</span>
        <h3><Link to={url}>{product.name}</Link></h3>
        <p className="ob-card-family">{product.family} · {product.gender}</p>
        <div className="ob-card-purchase">
          <select value={size} onChange={(event) => setSize(event.target.value)} aria-label={`Decant size for ${product.name}`}>
            {sizes.map((option) => <option key={option} value={option}>{option} decant</option>)}
          </select>
          <span className="ob-card-price">৳{product.sizes[size]}</span>
          <button className="ob-card-add" disabled={!product.inStock} aria-label={`Add ${size} ${product.name} to bag`} onClick={() => addItem({ id: product.id, brand: product.brand, name: product.name, size, price: product.sizes[size], family: product.family })}>+</button>
        </div>
      </div>
    </article>
  );
}
