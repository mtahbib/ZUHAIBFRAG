import { createContext, useContext, useEffect, useState } from "react";

const ObCartContext = createContext(null);
const STORAGE_KEY = "ob_cart_v1";

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function ObCartProvider({ children }) {
  const [items, setItems] = useState(loadInitial);
  const [drawerOpen, setDrawer] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // product must include: id, brand, name, size, price
  const addItem = (product, qty = 1) => {
    const cartKey = `${product.id}-${product.size}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.cartKey === cartKey);
      if (existing) {
        return prev.map((i) => (i.cartKey === cartKey ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { ...product, cartKey, qty }];
    });
    setDrawer(true);
  };

  const removeItem = (cartKey) => setItems((prev) => prev.filter((i) => i.cartKey !== cartKey));

  const updateQty = (cartKey, delta) =>
    setItems((prev) =>
      prev.map((i) => (i.cartKey === cartKey ? { ...i, qty: i.qty + delta } : i)).filter((i) => i.qty > 0)
    );

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <ObCartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalItems,
        totalPrice,
        drawerOpen,
        setDrawer,
      }}
    >
      {children}
    </ObCartContext.Provider>
  );
}

export const useObCart = () => useContext(ObCartContext);
