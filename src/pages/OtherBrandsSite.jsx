import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ObCartProvider } from "../otherBrands/context/ObCartContext";
import { WishlistProvider } from "../otherBrands/context/WishlistContext";
import ObNavbar from "../otherBrands/components/ObNavbar";
import ObCartDrawer from "../otherBrands/components/ObCartDrawer";
import ObFooter from "../otherBrands/components/ObFooter";
import ObHome from "../otherBrands/pages/ObHome";
import ObShop from "../otherBrands/pages/ObShop";
import ObProductDetail from "../otherBrands/pages/ObProductDetail";
import ObWishlist from "../otherBrands/pages/ObWishlist";
import ObParvej from "../otherBrands/components/ObParvej";
import "../otherBrands/atelier.css";

export default function OtherBrandsSite() {
  const location = useLocation();

  useEffect(() => {
    document.body.classList.add("theme-light", "ob-body");
    return () => document.body.classList.remove("theme-light", "ob-body");
  }, []);

  return (
    <ObCartProvider>
      <WishlistProvider>
        <div className="ob-experience" style={{ minHeight: "100vh" }}>
          <ObNavbar />
          <Routes>
            <Route path="/" element={<ObHome />} />
            <Route path="/shop" element={<ObShop key={location.search} />} />
            <Route path="/product/:slug" element={<ObProductDetail key={location.pathname} />} />
            <Route path="/wishlist" element={<ObWishlist />} />
          </Routes>
          <ObFooter />
          <ObCartDrawer />
          <ObParvej />
        </div>
      </WishlistProvider>
    </ObCartProvider>
  );
}
