import { COLORS, FONT_SANS, FONT_SERIF } from "../theme";
import useIsMobile from "../../hooks/useIsMobile";
import ObCatalog from "../components/ObCatalog";
import ObFindYourScent from "../components/ObFindYourScent";
import ObReviews from "../components/ObReviews";

export default function ObShop() {
  const isMobile = useIsMobile();

  return (
    <div>
      <div style={{ padding: isMobile ? "50px 6% 10px" : "80px 8% 20px", background: `radial-gradient(ellipse at top, #FFF5EB, ${COLORS.ivory})`, textAlign: "center" }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: "10px", letterSpacing: "5px", color: COLORS.copper, marginBottom: "16px" }}>
          THE COLLECTION
        </div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: "clamp(2rem, 4.6vw, 3.2rem)", color: COLORS.espresso }}>
          Every house, one shelf.
        </div>
      </div>
      <ObCatalog />
      <ObFindYourScent />
      <ObReviews />
    </div>
  );
}
