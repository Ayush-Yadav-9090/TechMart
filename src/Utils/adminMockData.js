// DASHBOARD STATS
export const getMockStats = () => ({
  revenue: 78540,
  totalOrders: 324,
  totalUsers: 182,
  totalProducts: 56
});

// PRODUCTS
export const getProducts = () => [
  {
    id: "P001",
    name: "iPhone 15 Pro",
    brand: "Apple",
    category: "smartphones",
    price: 1299,
    stock: 18,
    rating: 4.8,
    reviews: 321,
    image: "https://images.unsplash.com/photo-1592286927505-f0e6b477c295"
  },
   {
    id: "P001",
    name: "iPhone 15 Pro",
    brand: "Apple",
    category: "smartphones",
    price: 1299,
    stock: 18,
    rating: 4.8,
    reviews: 321,
    image: "https://images.unsplash.com/photo-1592286927505-f0e6b477c295"
  },
   {
    id: "P001",
    name: "iPhone 15 Pro",
    brand: "Apple",
    category: "smartphones",
    price: 1299,
    stock: 18,
    rating: 4.8,
    reviews: 321,
    image: "https://images.unsplash.com/photo-1592286927505-f0e6b477c295"
  },
   {
    id: "P001",
    name: "iPhone 15 Pro",
    brand: "Apple",
    category: "smartphones",
    price: 1299,
    stock: 18,
    rating: 4.8,
    reviews: 321,
    image: "https://images.unsplash.com/photo-1592286927505-f0e6b477c295"
  },
  {
    id: "P002",
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "headphones",
    price: 399,
    stock: 9,
    rating: 4.7,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1585386959984-a41552231691"
  }
];

// ORDERS
export const loadOrders = () => [
  {
    id: "ORD101",
    customer: "John Doe",
    total: 1299,
    status: "pending",
    date: "2026-01-14"
  },
   {
    id: "ORD101",
    customer: "John Doe",
    total: 1299,
    status: "pending",
    date: "2026-01-14"
  },
   {
    id: "ORD101",
    customer: "John Doe",
    total: 1299,
    status: "pending",
    date: "2026-01-14"
  },
   {
    id: "ORD101",
    customer: "John Doe",
    total: 1299,
    status: "pending",
    date: "2026-01-14"
  },
   {
    id: "ORD101",
    customer: "John Doe",
    total: 1299,
    status: "pending",
    date: "2026-01-14"
  },
  {
    id: "ORD102",
    customer: "Jane Smith",
    total: 399,
    status: "shipped",
    date: "2026-01-13"
  }
];

// USERS
export const loadUsers = () => [
  { id: 1, name: "Admin", email: "admin@techmart.com", role: "admin" },
  { id: 2, name: "Alice", email: "alice@gmail.com", role: "customer" },
  { id: 2, name: "Alice", email: "alice@gmail.com", role: "customer" },
  { id: 2, name: "Alice", email: "alice@gmail.com", role: "customer" },
 
];
