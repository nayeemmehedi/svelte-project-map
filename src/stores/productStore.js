import { writable } from 'svelte/store';

// Store for products
export const products = writable([]);

// Fetch products from API
export async function fetchProducts() {
  try {
    const response = await fetch('https://muslim-sweets-backend.onrender.com/api/v1/product');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    products.set(data.products); // Assuming API returns `{ products: [...] }`
  } catch (error) {
    console.error('Error fetching products:', error);
    products.set([]); // Fallback to an empty array
  }
}
