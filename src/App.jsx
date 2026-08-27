import { Navigate, Route, Routes } from "react-router-dom";
import BrandLanding from "./pages/BrandLanding";
import YusufBhaiSite from "./pages/YusufBhaiSite";
import OtherBrandsSite from "./pages/OtherBrandsSite";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BrandLanding />} />
      <Route path="/yusuf-bhai/*" element={<YusufBhaiSite />} />
      <Route path="/other-brands/*" element={<OtherBrandsSite />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
