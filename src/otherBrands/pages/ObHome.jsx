import ObHero from "../components/ObHero";
import ObCatalog from "../components/ObCatalog";
import ObFindYourScent from "../components/ObFindYourScent";
import ObReviews from "../components/ObReviews";

// Hero → the interactive product catalog (grid/gallery) → the "Find Your
// Scent" guided quiz → customer reviews → footer (rendered by the layout).
export default function ObHome() {
  return (
    <div>
      <ObHero />
      <ObCatalog />
      <ObFindYourScent />
      <ObReviews />
    </div>
  );
}
