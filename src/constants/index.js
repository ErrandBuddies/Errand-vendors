export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const VENDOR_URL = import.meta.env.VITE_VENDOR_URL;
// Socket.IO URL (same as API base URL but without /api suffix)
export const SOCKET_URL =
  import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ||
  "http://localhost:4000";

export const ROUTES = {
  // Auth routes
  SIGNUP: "/signup",
  LOGIN: "/login",
  OTP: "/otp",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  TERMS_OF_SERVICE: "/terms-and-conditions",
  PRIVACY_POLICY: "/privacy-policy",

  // Main app routes
  DASHBOARD: "/dashboard",
  PRODUCTS: "/products",
  ORDERS: "/orders",
  SERVICES: "/services",
  PROFILE: "/profile",
  MESSAGES: "/messages",
  SETTINGS: "/settings",
  TRANSACTIONS: "/transactions",
};

export const API_ENDPOINTS = {
  // Auth
  SIGNUP: "/vendor/signup",
  LOGIN: "/vendor/login",
  LOGOUT: "/vendor/logout",
  VERIFY_EMAIL: "/vendor/verify-email",
  RESEND_OTP: "/vendor/resend-otp",
  VERIFY_OTP: "/vendor/verify-otp",
  INITIATE_RESET_PASSWORD: "/vendor/initiate-reset-password",
  COMPLETE_RESET_PASSWORD: "/vendor/complete-reset-password",

  // Profile
  GET_VENDOR_PROFILE: "/vendor/",
  UPDATE_PROFILE: "/vendor/update-profile",
  VERIFY_PROFILE: "/vendor/verify-profile",

  // Dashboard
  VENDOR_PRODUCTS: "/transactions/vendor-products",

  // Products
  PRODUCTS: "/products/vendor",
  UPDATE_PRODUCT: "/products/vendor/update",
  DELETE_PRODUCT: "/products/vendor",
  UPLOAD_PRODUCT_IMAGES: "/products/vendor/upload-image",
  DELETE_PRODUCT_IMAGE: "/products/vendor/image",

  // sponsorship
  SPONSORSHIP_PLANS: "/products/sponsorship-plans",
  INITIATE_SPONSORSHIP: "/products/initiate-sponsorship",
  COMPLETE_SPONSORSHIP: "/products/complete-sponsorship",

  // Services
  SERVICES: "/services",
  UPDATE_SERVICE: "/services",
  DELETE_SERVICE: "/services",
  UPLOAD_SERVICE_IMAGES: "/services/image",
  DELETE_SERVICE_IMAGE: "/services/image",

  // Orders
  ORDERS: "/orders/vendor",
  CONFIRM_ORDER: "/orders/vendor/confirm",

  // Chat
  GET_CONVERSATIONS: "/chat/vendor/conversation",
  GET_MESSAGES: "/chat/vendor/messages",

  // Wallet
  WALLET_BALANCE: "/payment/wallet",
  BANKS: "/payment/banks",
  INITIATE_WITHDRAWAL: "/payment/initiate-withdrawal",
  COMPLETE_WITHDRAWAL: "/payment/complete-withdrawal",
};

export const STORAGE_KEYS = {
  TOKEN: "vendor_token",
  USER: "vendor_user",
  EMAIL: "vendor_email",
};

export const imagePlaceholder = "/products/placeholder-product.png";
