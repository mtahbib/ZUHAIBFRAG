// Other Brands: paper, ink and burgundy, with a darker campaign stage.
// Zuhaib Fragrance is the retailer/curator here, not the manufacturer, so
// nothing in this palette should read as a single perfume brand's identity.

export const COLORS = {
  ivory: "#F7F5F0",
  sand: "#EDE8E3",
  espresso: "#302326",
  olive: "#69695C",
  copper: "#885566",

  // Derived tints used throughout for borders/surfaces/text-on-ivory.
  espressoSoft: "rgba(48,35,38,0.68)",
  espressoFaint: "rgba(48,35,38,0.56)",
  espressoHairline: "rgba(48,35,38,0.14)",
  oliveSoft: "rgba(98,102,83,0.16)",
  copperSoft: "rgba(136,85,102,0.12)",
  white: "#FFFFFF",
};

// Subtle per-family accent so the site's atmosphere can shift slightly by
// category (section 14 of the brief) without breaking the core identity —
// every tone here is still warm/muted, never bright.
export const FAMILY_THEME = {
  Fresh: { accent: "#8B9A8C", soft: "#EDF0E9", label: "Fresh" },
  Aquatic: { accent: "#7E9797", soft: "#E9EFEE", label: "Aquatic" },
  Citrus: { accent: "#C08A4E", soft: "#F3E8D8", label: "Citrus" },
  Woody: { accent: "#8C6B4F", soft: "#EDE4D8", label: "Woody" },
  Floral: { accent: "#B98B82", soft: "#F3E7E3", label: "Floral" },
  Gourmand: { accent: "#9C7A5C", soft: "#F0E6DA", label: "Gourmand" },
  Oriental: { accent: "#8B4A34", soft: "#EEE0D8", label: "Oriental" },
  Oud: { accent: "#4B4436", soft: "#E7E3D6", label: "Oud" },
};

export const FAMILIES = Object.keys(FAMILY_THEME);

export function familyTheme(family) {
  return FAMILY_THEME[family] ?? { accent: COLORS.copper, soft: COLORS.sand, label: family };
}

export const FONT_SERIF = "'Cormorant Garamond', serif";
export const FONT_SANS = "'Montserrat', sans-serif";

export const SIZE_ORDER = ["5ml", "6ml", "10ml", "15ml"];
