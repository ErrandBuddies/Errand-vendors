/**
 * Query Keys
 *
 * Centralized query key factory for consistent cache management
 * Using factory functions to ensure type safety and consistency
 */

export const QUERY_KEYS = {
  // Products
  PRODUCTS: ["products"],
  PRODUCT: (id) => ["products", id],

  // Profile
  VENDOR_PROFILE: ["vendor-profile"],

  // Dashboard
  DASHBOARD: ["dashboard"],
  DASHBOARD_STATS: (params) => ["dashboard", "stats", params],

  // Services
  SERVICES: ["services"],
  SERVICE: (id) => ["services", id],
};
