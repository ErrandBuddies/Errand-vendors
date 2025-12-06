export interface User {
  _id?: string;
  firstname: string;
  lastname: string;
  email: string;
  phone_num: string;
  phone_verified: boolean;
  wallet: number;
  address?: string;
  accredited: boolean;
  is_user: boolean;
  temp_wallet: number;
  country_code: string;
  followers: string[];
  followings: string[];
  role?: string;
  // Business fields
  occupation?: string;
  business_name?: string;
  business_location?: string;
  business_description?: string;
  // Location fields
  city?: string;
  state?: string;
  country?: string;
}


export interface AuthResponse {
  success: boolean;
  message: string;
  data?: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  firstname: string;
  lastname: string;
  email: string;
  phone_num: string;
  country_code: string;
  password: string;
  confirm_password: string;
}

export interface OTPPayload {
  email: string;
  otp: string;
}

export interface ResendOTPPayload {
  type: string;
  email: string;
}

export interface ResetPasswordPayload {
  type: string;
  email: string;
  token: string;
  password: string;
  confirm_password: string;
}

export interface Product {
  _id: string;
  name: string;
  category: string;
  images: string[];
}

export interface ShippingAddress {
  address: string;
  city: string;
  state: string;
  country: string;
  phone1: string;
  latitude: number;
  longitude: number;
}

export interface Order {
  _id: string;
  shippingAddress: ShippingAddress;
  orderDate: string;
}

export interface Customer {
  _id: string;
  firstname: string;
  lastname: string;
}

export interface Sale {
  _id: string;
  productName: string;
  quantity: number;
  price: number;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  product: Product;
  order: Order;
  customer: Customer;
}

export interface WalletDetails {
  reference: string;
  amountUsed: number;
  previousBalance: number;
  newBalance: number;
}

export interface OnlineDetails {
  amountPaid: number;
  reference: string;
  accessCode: string;
}

export interface Transaction {
  _id: string;
  serviceId: string;
  serviceType: string;
  currency: string;
  amount: number;
  status: string;
  transactionType: string;
  paymentMethod: string;
  walletDetails?: WalletDetails;
  onlineDetails?: OnlineDetails;
  description: string;
  createdAt: string;
  updatedAt: string;
  type: string;
}

export interface SalesData {
  data: Sale[];
  totalSales: number;
  salesRevenue: number;
}

export interface TransactionData {
  data: Transaction[];
  totalPayments: number;
  transactionRevenue: number;
}

export interface DashboardData {
  sales: SalesData;
  transactions: TransactionData;
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}
