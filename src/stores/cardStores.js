import { writable } from 'svelte/store';

export const cart = writable([]);

// Add product to cart
export const addToCart = (product) => {
  cart.update((items) => {
    const existingItem = items.find((item) => item.id === product.id);
    if (existingItem) {
      return items.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }
    return [...items, { ...product, quantity: 1 }];
  });
};

// Remove product from cart
export const removeFromCart = (id) => {
  cart.update((items) => items.filter((item) => item.id !== id));
};
