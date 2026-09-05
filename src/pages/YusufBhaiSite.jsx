import { useEffect, useState } from "react";
import { CartProvider } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";
import CursorGlow from "../components/CursorGlow";
import GrainOverlay from "../components/GrainOverlay";
import ScrollProgress from "../components/ScrollProgress";
import Marquee from "../components/Marquee";
import Collections from "../components/Collections";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import NotesSection from "../components/NotesSection";
import OrderSection from "../components/OrderSection";
import ParticleField from "../components/ParticleField";
import ProductCatalog from "../components/ProductCatalog";
import SmoothScroll from "../components/SmoothScroll";
import StorySection from "../components/StorySection";
import Parvej from "../components/Parvej";
import "../yusufAtelier.css";

export default function YusufBhaiSite() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Yusuf Bhai Fragrances — Zuhaib Fragrance";
    document.body.classList.add("has-custom-cursor", "yb-body");
    return () => {
      document.title = previousTitle;
      document.body.classList.remove("has-custom-cursor", "yb-body");
    };
  }, []);

  if (loading) {
    return <Loader onFinish={() => setLoading(false)} />;
  }

  return (
    <CartProvider>
      <div className="yb-experience">
      <GrainOverlay />
      <ScrollProgress />
      <ParticleField />
      <CursorGlow />
      <SmoothScroll />
      <Navbar />
      <CartDrawer />
      <Hero />
      <Marquee />
      <StorySection />
      <Collections />
      <Marquee inverted />
      <ProductCatalog />
      <NotesSection />
      <OrderSection />
      <Footer />
      <Parvej />
      </div>
    </CartProvider>
  );
}
