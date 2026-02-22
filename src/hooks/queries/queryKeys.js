/**
 * Query Keys
 *
 * Centralized query key factory for consistent cache management
 * Using factory functions to ensure type safety and consistency
 */

export const queryKeys = {
  // Products
  products: {
    all: ["products"],
    detail: (id) => [...queryKeys.products.all, id],
  },

  // Profile
  profile: {
    all: ["vendor-profile"],
  },

  // Dashboard
  dashboard: {
    all: ["dashboard"],
    stats: (params) => [...queryKeys.dashboard.all, "stats", params],
  },

  // Services
  services: {
    all: ["services"],
    detail: (id) => [...queryKeys.services.all, id],
  },

  // Orders
  orders: {
    all: ["orders"],
    list: () => [...queryKeys.orders.all, "list"],
  },

  // Chat
  chat: {
    all: ["chat"],
    conversations: () => [...queryKeys.chat.all, "conversations"],
    messages: (recipientId) => [...queryKeys.chat.all, "messages", recipientId],
  },

  // Wallet
  wallet: {
    balance: ["wallet-balance"],
    banks: ["banks"],
  },
};

// Legacy exports for backward compatibility
export const QUERY_KEYS = {
  PRODUCTS: queryKeys.products.all,
  PRODUCT: queryKeys.products.detail,
  VENDOR_PROFILE: queryKeys.profile.all,
  DASHBOARD: queryKeys.dashboard.all,
  DASHBOARD_STATS: queryKeys.dashboard.stats,
  SERVICES: queryKeys.services.all,
  SERVICE: queryKeys.services.detail,
  ORDERS: queryKeys.orders.all,
  ORDER: (id) => [...queryKeys.orders.all, id],
  WALLET_BALANCE: queryKeys.wallet.balance,
  BANKS: queryKeys.wallet.banks,
};
