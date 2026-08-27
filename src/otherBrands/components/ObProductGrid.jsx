import { useMemo, useState } from "react";
import { COLORS, FAMILIES, FONT_SANS, FONT_SERIF, SIZE_ORDER } from "../theme";
import { otherBrandsProducts } from "../data/products";
import { moodByKey } from "../moodMap";
import useIsMobile from "../../hooks/useIsMobile";
import SplitHeading from "../../components/SplitHeading";
import ObProductCard from "./ObProductCard";

const BRANDS = [...new Set(otherBrandsProducts.map((p) => p.brand))].sort();
const MAX_PRICE = Math.max(...otherBrandsProducts.map((p) => p.startingPrice));

const SORTS = [
  { key: "featured", label: "Featured" },
  { key: "bestselling", label: "Best Selling" },
  { key: "newest", label: "New Arrivals" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
];

// Reads ?mood=… / ?family=… from the URL once, at mount. ObHome remounts
// this component (via a `key` on location.search) whenever a mood/family
// card sends the user here with a new query, so this only needs to run once
// per mount rather than reacting to prop changes in an effect.
function initialFilters() {
  const params = new URLSearchParams(window.location.search);
  const moodKey = params.get("mood");
  const familyKey = params.get("family");
  const mood = moodKey ? moodByKey(moodKey) : null;

  return {
    brands: new Set(),
    genders: new Set(),
    families: new Set(mood ? mood.families : familyKey ? [familyKey] : []),
    sizes: new Set(),
    availability: "all",
    priceMax: MAX_PRICE,
    query: "",
  };
}

function toggleInSet(set, value) {
  const next = new Set(set);
  next.has(value) ? next.delete(value) : next.add(value);
  return next;
}

function ChipGroup({ title, options, active, onToggle }) {
  return (
    <div style={{ marginBottom: "22px" }}>
      <div style={{ fontFamily: FONT_SANS, fontSize: "10px", letterSpacing: "1.5px", color: COLORS.espressoFaint, marginBottom: "10px" }}>
        {title.toUpperCase()}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
        {options.map((opt) => {
          const isActive = active.has(opt);
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              style={{
                fontFamily: FONT_SANS,
                fontSize: "10.5px",
                padding: "7px 13px",
                borderRadius: "999px",
                border: `1px solid ${isActive ? COLORS.espresso : COLORS.espressoHairline}`,
                background: isActive ? COLORS.espresso : "transparent",
                color: isActive ? COLORS.ivory : COLORS.espressoSoft,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FilterPanel({ filters, setFilters }) {
  return (
    <div>
      <input
        value={filters.query}
        onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
        placeholder="Filter by name, brand, note…"
        style={{
          width: "100%",
          boxSizing: "border-box",
          background: COLORS.sand,
          border: "none",
          borderRadius: "10px",
          padding: "11px 14px",
          fontFamily: FONT_SANS,
          fontSize: "12px",
          color: COLORS.espresso,
          outline: "none",
          marginBottom: "22px",
        }}
      />

      <ChipGroup
        title="Gender"
        options={["Men", "Women", "Unisex"]}
        active={filters.genders}
        onToggle={(v) => setFilters((f) => ({ ...f, genders: toggleInSet(f.genders, v) }))}
      />
      <ChipGroup
        title="Fragrance Family"
        options={FAMILIES}
        active={filters.families}
        onToggle={(v) => setFilters((f) => ({ ...f, families: toggleInSet(f.families, v) }))}
      />
      <ChipGroup
        title="Brand"
        options={BRANDS}
        active={filters.brands}
        onToggle={(v) => setFilters((f) => ({ ...f, brands: toggleInSet(f.brands, v) }))}
      />
      <ChipGroup
        title="Size"
        options={SIZE_ORDER}
        active={filters.sizes}
        onToggle={(v) => setFilters((f) => ({ ...f, sizes: toggleInSet(f.sizes, v) }))}
      />
      <ChipGroup
        title="Availability"
        options={["In Stock", "Out of Stock"]}
        active={
          filters.availability === "inStock"
            ? new Set(["In Stock"])
            : filters.availability === "outOfStock"
            ? new Set(["Out of Stock"])
            : new Set()
        }
        onToggle={(v) =>
          setFilters((f) => ({
            ...f,
            availability:
              v === "In Stock"
                ? f.availability === "inStock" ? "all" : "inStock"
                : f.availability === "outOfStock" ? "all" : "outOfStock",
          }))
        }
      />

      <div style={{ marginBottom: "10px" }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: "10px", letterSpacing: "1.5px", color: COLORS.espressoFaint, marginBottom: "10px" }}>
          PRICE — UP TO ৳{filters.priceMax}
        </div>
        <input
          type="range"
          min={200}
          max={MAX_PRICE}
          step={10}
          value={filters.priceMax}
          onChange={(e) => setFilters((f) => ({ ...f, priceMax: Number(e.target.value) }))}
          style={{ width: "100%", accentColor: COLORS.copper }}
        />
      </div>

      <button
        onClick={() => setFilters(initialFilters())}
        style={{
          marginTop: "8px",
          fontFamily: FONT_SANS,
          fontSize: "10.5px",
          letterSpacing: "1px",
          color: COLORS.espressoSoft,
          background: "none",
          border: "none",
          textDecoration: "underline",
          cursor: "pointer",
          padding: 0,
        }}
      >
        Clear all filters
      </button>
    </div>
  );
}

export default function ObProductGrid() {
  const isMobile = useIsMobile();
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState("featured");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = otherBrandsProducts.filter((p) => {
      if (filters.brands.size && !filters.brands.has(p.brand)) return false;
      if (filters.genders.size && !filters.genders.has(p.gender)) return false;
      if (filters.families.size && !filters.families.has(p.family)) return false;
      if (filters.sizes.size && ![...filters.sizes].some((s) => p.sizes[s])) return false;
      if (filters.availability === "inStock" && !p.inStock) return false;
      if (filters.availability === "outOfStock" && p.inStock) return false;
      if (p.startingPrice > filters.priceMax) return false;
      if (filters.query.trim()) {
        const q = filters.query.trim().toLowerCase();
        const hay = [p.brand, p.name, p.family, ...p.topNotes, ...p.heartNotes, ...p.baseNotes]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    switch (sort) {
      case "bestselling":
        list = [...list].sort((a, b) => Number(b.bestseller) - Number(a.bestseller));
        break;
      case "newest":
        list = [...list].sort((a, b) => Number(b.newArrival) - Number(a.newArrival));
        break;
      case "price-asc":
        list = [...list].sort((a, b) => a.startingPrice - b.startingPrice);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.startingPrice - a.startingPrice);
        break;
      default:
        break;
    }
    return list;
  }, [filters, sort]);

  return (
    <section id="catalog" style={{ padding: isMobile ? "70px 5%" : "120px 8%", background: COLORS.ivory }}>
      <div style={{ textAlign: "center", marginBottom: isMobile ? "36px" : "56px" }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: "10px", letterSpacing: "5px", color: COLORS.copper, marginBottom: "16px" }}>
          FEATURED FRAGRANCES
        </div>
        <SplitHeading
          text="The full collection."
          style={{
            fontFamily: FONT_SERIF, fontWeight: 400, color: COLORS.espresso,
            fontSize: "clamp(1.9rem, 4vw, 3rem)", margin: 0,
          }}
        />
      </div>

      <div style={{ maxWidth: "1320px", margin: "0 auto", display: "flex", gap: "40px", alignItems: "flex-start" }}>
        {!isMobile && (
          <aside style={{ width: "240px", flexShrink: 0, position: "sticky", top: "100px" }}>
            <FilterPanel filters={filters} setFilters={setFilters} />
          </aside>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ fontFamily: FONT_SANS, fontSize: "11px", color: COLORS.espressoFaint }}>
              {filtered.length} fragrance{filtered.length === 1 ? "" : "s"}
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {isMobile && (
                <button
                  onClick={() => setDrawerOpen(true)}
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: "10.5px",
                    letterSpacing: "1px",
                    padding: "9px 16px",
                    borderRadius: "999px",
                    border: `1px solid ${COLORS.espressoHairline}`,
                    background: COLORS.white,
                    color: COLORS.espresso,
                    cursor: "pointer",
                  }}
                >
                  FILTERS
                </button>
              )}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: "10.5px",
                  letterSpacing: "0.5px",
                  padding: "9px 14px",
                  borderRadius: "999px",
                  border: `1px solid ${COLORS.espressoHairline}`,
                  background: COLORS.white,
                  color: COLORS.espresso,
                  cursor: "pointer",
                }}
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    Sort: {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: COLORS.espressoFaint,
                fontFamily: FONT_SANS,
                fontSize: "13px",
              }}
            >
              No fragrances match these filters. Try widening your search.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(240px, 1fr))",
                gap: isMobile ? "12px" : "22px",
              }}
            >
              {filtered.map((p) => (
                <ObProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {isMobile && drawerOpen && (
        <>
          <div
            onClick={() => setDrawerOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(33,28,24,0.4)", zIndex: 90 }}
          />
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "82%",
              maxWidth: "340px",
              background: COLORS.ivory,
              zIndex: 91,
              padding: "24px 20px",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ fontFamily: FONT_SERIF, fontSize: "1.2rem", color: COLORS.espresso }}>Filters</div>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{ background: "none", border: "none", fontSize: "18px", color: COLORS.espresso, cursor: "pointer" }}
              >
                ✕
              </button>
            </div>
            <FilterPanel filters={filters} setFilters={setFilters} />
          </div>
        </>
      )}
    </section>
  );
}
