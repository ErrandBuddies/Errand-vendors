import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants";

// ==================================================
// *** AUTH SERVICES ***
// ==================================================
export const authService = {
  signup: async (payload) => {
    const response = await axiosInstance.post(API_ENDPOINTS.SIGNUP, payload);
    return response.data;
  },

  login: async (payload) => {
    const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, payload);
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post(API_ENDPOINTS.LOGOUT);
    return response.data;
  },

  verifyEmail: async (payload) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.VERIFY_EMAIL,
      payload,
    );
    return response.data;
  },

  resendOTP: async (payload) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.RESEND_OTP,
      payload,
    );
    return response.data;
  },

  verifyOTP: async (payload) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.VERIFY_OTP,
      payload,
    );
    return response.data;
  },

  initiateResetPassword: async (payload) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.INITIATE_RESET_PASSWORD,
      payload,
    );
    return response.data;
  },

  completeResetPassword: async (payload) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.COMPLETE_RESET_PASSWORD,
      payload,
    );
    return response.data;
  },
};

// ==================================================
// *** DASHBOARD SERVICES ***
// ==================================================
export const dashboardService = {
  getVendorProducts: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.VENDOR_PRODUCTS}?${queryString}`,
    );
    return response.data;
  },
};

// ==================================================
// *** PROFILE SERVICES ***
// ==================================================
export const profileService = {
  getVendorProfile: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.GET_VENDOR_PROFILE);
    return response.data;
  },

  updateProfile: async (payload) => {
    const response = await axiosInstance.patch(
      API_ENDPOINTS.UPDATE_PROFILE,
      payload,
    );
    return response.data;
  },

  updateAddress: async (payload) => {
    const response = await axiosInstance.patch(
      API_ENDPOINTS.UPDATE_PROFILE,
      payload,
    );
    return response.data;
  },

  verifyProfile: async (payload) => {
    const formData = new FormData();
    formData.append("id_num", payload.id_num);
    formData.append("country_code", payload.country_code);
    formData.append("dob", payload.dob);
    formData.append("image", payload.image);

    const response = await axiosInstance.patch(
      API_ENDPOINTS.VERIFY_PROFILE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },
};

// ==================================================
// *** PRODUCT SERVICES ***
// ==================================================
export const productService = {
  getProducts: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS);
    return response.data;
  },

  createProduct: async (payload) => {
    const formData = new FormData();

    // Add all non-file fields
    Object.keys(payload).forEach((key) => {
      if (key === "images") return; // Handle images separately

      const value = payload[key];
      if (Array.isArray(value)) {
        // For arrays like colors, sizes, tags
        value.forEach((item) => formData.append(`${key}[]`, item));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    // Add images
    if (payload.images && payload.images.length > 0) {
      payload.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await axiosInstance.post(
      API_ENDPOINTS.PRODUCTS,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  updateProduct: async (id, payload) => {
    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.UPDATE_PRODUCT}/${id}`,
      payload,
    );
    return response.data;
  },

  deleteProduct: async (id, reason, softDelete) => {
    const params = new URLSearchParams();
    if (reason) params.append("reason", reason);
    if (softDelete) params.append("softDelete", softDelete);
    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.DELETE_PRODUCT}/${id}?${params.toString()}`,
    );
    return response.data;
  },

  uploadImages: async (productId, images) => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    const response = await axiosInstance.post(
      `${API_ENDPOINTS.UPLOAD_PRODUCT_IMAGES}/${productId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  getProductReviews: async (productId) => {
    const response = await axiosInstance.get(`/products/reviews/${productId}`);
    return response.data;
  },

  deleteImage: async (productId, imageId) => {
    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.DELETE_PRODUCT_IMAGE}/${productId}/${imageId}`,
    );
    return response.data;
  },
};

// ==================================================
// *** SPONSORSHIP SERVICES ***
// ==================================================
export const sponsorshipService = {
  getSponsorshipPlans: async () => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.SPONSORSHIP_PLANS}`,
    );
    return response.data;
  },

  initiateSponsorship: async (payload) => {
    const formData = new FormData();
    Object.keys(payload).forEach((key) => {
      formData.append(key, payload[key]);
    });
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.INITIATE_SPONSORSHIP}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  completeSponsorship: async (payload) => {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.COMPLETE_SPONSORSHIP}`,
      payload,
    );
    return response.data;
  },
};

// ==================================================
// *** SERVICE SERVICES ***
// ==================================================
export const serviceService = {
  getServices: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.SERVICES);
    return response.data;
  },

  createService: async (payload) => {
    const formData = new FormData();

    // Add all non-file fields
    Object.keys(payload).forEach((key) => {
      if (key === "images") return; // Handle images separately

      const value = payload[key];
      if (Array.isArray(value)) {
        // For arrays like tags
        value.forEach((item) => formData.append(`${key}[]`, item));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    // Add images
    if (payload.images && payload.images.length > 0) {
      payload.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await axiosInstance.post(
      API_ENDPOINTS.SERVICES,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  updateService: async (id, payload) => {
    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.UPDATE_SERVICE}/${id}`,
      payload,
    );
    return response.data;
  },

  deleteService: async (id, reason) => {
    const params = reason ? `?reason=${reason}` : "";
    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.DELETE_SERVICE}/${id}${params}`,
    );
    return response.data;
  },

  uploadImages: async (serviceId, images) => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.UPLOAD_SERVICE_IMAGES}/${serviceId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  deleteImage: async (serviceId, imageId) => {
    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.DELETE_SERVICE_IMAGE}/${serviceId}/${imageId}`,
    );
    return response.data;
  },

  getServiceReviews: async (serviceId) => {
    const response = await axiosInstance.get(`/services/reviews/${serviceId}`);
    return response.data;
  },
};

// ==================================================
// *** ORDER SERVICES ***
// ==================================================
export const orderService = {
  getOrders: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDERS);
    return response.data;
  },

  confirmOrder: async (payload) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.CONFIRM_ORDER,
      payload,
    );
    return response.data;
  },
};

// ==================================================
// *** CHAT SERVICES ***
// ==================================================
export const chatService = {
  getConversations: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.GET_CONVERSATIONS);
    return response.data;
  },

  getMessages: async (recipientId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_ENDPOINTS.GET_MESSAGES}/${recipientId}${queryString ? `?${queryString}` : ""}`;
    const response = await axiosInstance.get(url);
    return response.data;
  },
};

// ==================================================
// *** WALLET SERVICES ***
// ==================================================
export const walletService = {
  getWalletBalance: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.WALLET_BALANCE);
    return response.data;
  },

  getBanks: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.BANKS);
    return response.data;
  },

  initiateWithdrawal: async (payload) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.INITIATE_WITHDRAWAL,
      payload,
    );
    return response.data;
  },

  completeWithdrawal: async (payload) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.COMPLETE_WITHDRAWAL,
      payload,
    );
    return response.data;
  },
};
