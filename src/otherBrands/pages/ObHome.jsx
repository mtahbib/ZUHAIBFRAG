import ObHero from "../components/ObHero";
import ObCatalog from "../components/ObCatalog";
import ObFindYourScent from "../components/ObFindYourScent";
import ObReviews from "../components/ObReviews";
import { Link } from "react-router-dom";

// Hero → the interactive product catalog (grid/gallery) → the "Find Your
// Scent" guided quiz → customer reviews → footer (rendered by the layout).
export default function ObHome() {
  return (
    <div>
      <ObHero />
      <div className="ob-houses-strip" aria-label="Explore fragrance houses">
        <span>EXCEPTIONAL HOUSES.<br /> ONE DESTINATION.</span>
        <div className="ob-houses-list">
          {["French Avenue", "RASASI", "Lattafa", "AFNAN", "Versace", "ARMAF"].map((brand) => <Link key={brand} to={`/other-brands/shop?q=${encodeURIComponent(brand)}`}>{brand}</Link>)}
        </div>
      </div>
      <ObCatalog />
      <ObFindYourScent />
      <ObReviews />
    </div>
  );
}
