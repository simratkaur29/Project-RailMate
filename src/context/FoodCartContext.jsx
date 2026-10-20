import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const FoodCartContext = createContext(null);

/**
 * FoodCartProvider — Shared cart state for the Station Bites feature.
 *
 * - Items are keyed by dish ID to prevent duplicates.
 * - All items must belong to the same restaurant.
 * - Cart is persisted to localStorage.
 * - Invalid/corrupted localStorage data is handled safely.
 */
export function FoodCartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('railmate_food_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Corrupted data — start fresh
    }
    return [];
  });

  const [cartRestaurant, setCartRestaurant] = useState(() => {
    try {
      const saved = localStorage.getItem('railmate_food_cart_restaurant');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      }
    } catch {
      // Corrupted data — start fresh
    }
    return null;
  });

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('railmate_food_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(
      'railmate_food_cart_restaurant',
      JSON.stringify(cartRestaurant)
    );
  }, [cartRestaurant]);

  /**
   * Add an item. If the item already exists, increment quantity.
   * Returns { success, needsConfirmation } if restaurant mismatch.
   */
  const addItem = useCallback((item, restaurant) => {
    if (cartRestaurant && cartRestaurant.id !== restaurant.id && cartItems.length > 0) {
      return { success: false, needsConfirmation: true };
    }

    setCartRestaurant({ id: restaurant.id, name: restaurant.name });

    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    return { success: true };
  }, [cartRestaurant, cartItems.length]);

  /**
   * Force-add after user confirms restaurant switch.
   * Clears existing cart and adds the new item.
   */
  const forceAddItem = useCallback((item, restaurant) => {
    setCartRestaurant({ id: restaurant.id, name: restaurant.name });
    setCartItems([{ ...item, quantity: 1 }]);
  }, []);

  const increaseQuantity = useCallback((itemId) => {
    setCartItems((prev) =>
      prev.map((ci) =>
        ci.id === itemId ? { ...ci, quantity: ci.quantity + 1 } : ci
      )
    );
  }, []);

  const decreaseQuantity = useCallback((itemId) => {
    setCartItems((prev) => {
      const item = prev.find((ci) => ci.id === itemId);
      if (item && item.quantity <= 1) {
        const remaining = prev.filter((ci) => ci.id !== itemId);
        if (remaining.length === 0) {
          setCartRestaurant(null);
        }
        return remaining;
      }
      return prev.map((ci) =>
        ci.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci
      );
    });
  }, []);

  const removeItem = useCallback((itemId) => {
    setCartItems((prev) => {
      const remaining = prev.filter((ci) => ci.id !== itemId);
      if (remaining.length === 0) {
        setCartRestaurant(null);
      }
      return remaining;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setCartRestaurant(null);
  }, []);

  const itemCount = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);

  const subtotal = cartItems.reduce(
    (sum, ci) => sum + ci.price * ci.quantity,
    0
  );

  const getItemQuantity = useCallback(
    (itemId) => {
      const item = cartItems.find((ci) => ci.id === itemId);
      return item ? item.quantity : 0;
    },
    [cartItems]
  );

  const value = {
    cartItems,
    cartRestaurant,
    addItem,
    forceAddItem,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
    itemCount,
    subtotal,
    getItemQuantity,
  };

  return (
    <FoodCartContext.Provider value={value}>
      {children}
    </FoodCartContext.Provider>
  );
}

/**
 * Custom hook for accessing the FoodCartContext.
 */
export function useFoodCart() {
  const context = useContext(FoodCartContext);
  if (!context) {
    throw new Error('useFoodCart must be used within a FoodCartProvider');
  }
  return context;
}

export default FoodCartContext;
