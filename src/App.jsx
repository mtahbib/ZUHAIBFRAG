import { useState } from "react";
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/CartDrawer";
import CursorGlow from "./components/CursorGlow";
import Collections from "./components/Collections";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import NotesSection from "./components/NotesSection";
import OrderSection from "./components/OrderSection";
import ParticleField from "./components/ParticleField";
import ProductCatalog from "./components/ProductCatalog";
import SmoothScroll from "./components/SmoothScroll";
import StorySection from "./components/StorySection";

export default function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <Loader onFinish={() => setLoading(false)} />;
  }

  return (
    <CartProvider>
      <ParticleField />
      <CursorGlow />
      <SmoothScroll />
      <Navbar />
      <CartDrawer />
      <Hero />
      <StorySection />
      <Collections />
      <ProductCatalog />
      <NotesSection />
      <OrderSection />
      <Footer />
    </CartProvider>
  );
}