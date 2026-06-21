import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems]       = useState([]);
  const [drawerOpen, setDrawer] = useState(false);

  const addItem = (product) => {
    const key = product.cartKey || String(product.id);
    setItems((prev) => {
      const existing = prev.find((i) => i.cartKey === key);
      if (existing)
        return prev.map((i) =>
          i.cartKey === key ? { ...i, qty: i.qty + 1 } : i
        );
      return [...prev, { ...product, cartKey: key, qty: 1 }];
    });
    setDrawer(true);
  };

  const removeItem = (cartKey) =>
    setItems((prev) => prev.filter((i) => i.cartKey !== cartKey));

  const updateQty = (cartKey, delta) =>
    setItems((prev) =>
      prev
        .map((i) => (i.cartKey === cartKey ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalItems,
        drawerOpen,
        setDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
