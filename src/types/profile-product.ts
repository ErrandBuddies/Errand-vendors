// Profile payloads
export interface UpdateProfilePayload {
  firstname?: string;
  lastname?: string;
  occupation?: string;
  business_name?: string;
  business_location?: string;
  business_description?: string;
}

export interface UpdateAddressPayload {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface VerifyProfilePayload {
  id_num: string;
  country_code: string;
  dob: string;
  image: File;
}

// Product types
export interface ProductLocation {
  state: string;
  city: string;
  country: string;
  address: string;
  longitude?: number;
  latitude?: number;
}

export interface ProductRating {
  rate: number;
  number: number;
}

export interface Sponsorship {
  _id: string;
  banner?: string;
  type: string;
  featuredPrice: number;
  amount: number;
  available: number;
  caption: string;
  startDate: string;
  endDate: string | null;
  status: string;
}

export interface ProductFull {
  _id: string;
  vendorDetails?: string;
  name: string;
  desc: string;
  category: string;
  sub_category: string;
  currency: string;
  price: number;
  location: ProductLocation;
  images: string[];
  amount_in_stock: number;
  tags: string[];
  brand?: string;
  stock_type: string[];
  weight?: number;
  colors?: string[];
  sizes?: string[];
  condition: string;
  ratings: ProductRating;
  status: string;
  favourites: number;
  carts: number;
  visible: boolean;
  sponsored: boolean;
  sales: number;
  discount_price: number;
  sponsored_caption?: string | null;
  sponsored_due_date?: string | null;
  sponsored_type?: string | null;
  sponsorship?: Sponsorship;
  clicks?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductPayload {
  name: string;
  desc: string;
  category: string;
  sub_category: string;
  price: number | string;
  currency: string;
  stock_type: string;
  amount_in_stock: number | string;
  condition: string;
  state: string;
  city: string;
  country: string;
  address?: string;
  brand?: string;
  weight?: number | string;
  colors?: string[];
  sizes?: string[];
  tags?: string[];
  discount_price?: number | string;
  images: File[];
}

export interface UpdateProductPayload {
  name?: string;
  desc?: string;
  category?: string;
  sub_category?: string;
  price?: number | string;
  currency?: string;
  stock_type?: string;
  amount_in_stock?: number | string;
  condition?: string;
  state?: string;
  city?: string;
  country?: string;
  address?: string;
  tags?: string[];
  discount_price?: number | string;
  colors?: string[];
  sizes?: string[];
  brand?: string;
  weight?: number | string;
}
