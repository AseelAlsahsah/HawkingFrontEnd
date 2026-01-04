import axios from "axios";

const publicApi = axios.create({
  baseURL: "/api/v1",
});

publicApi .interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------------- admin items management ----------------------
export interface Item {
  id: number;
  code: string;
  name: string;
  description: string;
  categoryName: string;
  karatName: string;
  priceAfterDiscount: number | null;
  priceBeforeDiscount: number;
  discountPercentage: number | null;
  factoryPrice: number;
  weight: number;
  imageUrl: string;
  inStockCount: number;
}

export interface PageMeta {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface ItemSearchResponse {
  content: Item[];
  page: PageMeta;
}

export interface AdminItem {
  id: number;
  code: string;
  name: string;
  description: string;
  weight: number;
  category: { 
    id: number; 
    name: string; 
    description: string; 
    imageUrl: string | null 
  };
  karat: { 
    id: number; 
    name: string; 
    displayName: string 
  };
  factoryPrice: number;
  imageUrl: string;
  inStockCount: number;
  isActive: boolean;
  priceBeforeDiscount: number;
  reservedCount: number;
  discountPercentage?: number;
  priceAfterDiscount?: number;
  goldPricePerGram?: number;
}


export interface AdminItemsResponse {
  content: AdminItem[];
  page: PageMeta;
}

// Admin Items API functions
export async function adminFetchItems(params: {
  page?: number;
  size?: number;
  categoryName?: string;
}) {
  const { page = 0, size = 10, categoryName } = params;
  const response = await publicApi.get<AdminItemsResponse>("/items", {
    params: { page, size, categoryName },
  });
  return response.data;
}

export async function adminGetItemById(id: number) {
  const response = await publicApi.get<AdminItem>(`/items/${id}`);
  return response.data;
}

export async function adminGetItemByCode(code: string) {
  const response = await publicApi.get<AdminItem>(`/items/${code}`);
  return response.data;
}

export async function adminCreateItem(item: Omit<AdminItem, 'id' | 'category' | 'karat' | 'priceBeforeDiscount' | 'priceAfterDiscount' | 'goldPricePerGram' | 'reservedCount'>) {
  const response = await publicApi.post<AdminItem>("/items", item);
  return response.data;
}

export async function adminUpdateItem(id: number, item: Partial<AdminItem>) {
  const response = await publicApi.put<AdminItem>(`/items/${id}`, item);
  return response.data;
}

export async function adminDeleteItem(code: string) { 
  await publicApi.delete(`/items/code/${code}`); 
}

// ------------------------ admin categories ----------------------
export interface AdminCategory {
  id: number;
  name: string;
  description: string;
}

export interface AdminCategoriesResponse {
  content: AdminCategory[];
  page: PageMeta;
}

// Get category by ID
export async function adminGetCategoryById(id: number): Promise<AdminCategory> {
  const response = await publicApi.get<AdminCategory>(`/category/${id}`);
  return response.data;
}

// Create category
export async function adminCreateCategory(category: { name: string; description: string }): Promise<AdminCategory> {
  const response = await publicApi.post<AdminCategory>('/category', category);
  return response.data;
}

// Update category
export async function adminUpdateCategory(id: number, category: Partial<AdminCategory>): Promise<AdminCategory> {
  const response = await publicApi.put<AdminCategory>(`/category/${id}`, category);
  return response.data;
}

// Delete category
export async function adminDeleteCategory(id: number): Promise<void> {
  await publicApi.delete(`/category/${id}`);
}

// ------------------ admin karats ----------------------
export interface AdminKarat {
  id: number;
  name: string;
  displayName: string;
}

export interface AdminKaratsResponse {
  content: AdminKarat[];
  page: PageMeta;
}

export async function adminGetKaratById(id: number): Promise<AdminKarat> {
  const response = await publicApi.get<AdminKarat>(`/karat/${id}`);
  return response.data;
}

export async function adminCreateKarat(karat: { name: string; displayName: string }): Promise<AdminKarat> {
  const response = await publicApi.post<AdminKarat>('/karat', karat);
  return response.data;
}

export async function adminUpdateKarat(id: number, karat: Partial<AdminKarat>): Promise<AdminKarat> {
  const response = await publicApi.put<AdminKarat>(`/karat/${id}`, karat);
  return response.data;
}

export async function adminDeleteKarat(id: number): Promise<void> {
  await publicApi.delete(`/karat/${id}`);
}

//--------------------- admin gold price -----------------------------
export interface AdminGoldPrice {
  id: number;
  karatName: string;
  karat: {
    displayName: string;
    id: number;
    name: string;
  };
  pricePerGram: number;
  effectiveDate: string;
  isActive: boolean;
}

export interface AdminGoldPricesResponse {
  content: AdminGoldPrice[];
  page: PageMeta;
}

export async function adminFetchGoldPrices(params: {
  page?: number;
  size?: number;
}): Promise<AdminGoldPricesResponse> {
  const { page = 0, size = 20 } = params;
  const response = await publicApi.get<AdminGoldPricesResponse>("/gold-price", {
    params: { page, size },
  });
  return response.data;
}

export async function adminGetGoldPriceById(id: number): Promise<AdminGoldPrice> {
  const response = await publicApi.get<AdminGoldPrice>(`/gold-price/${id}`);
  return response.data;
}

export async function adminCreateGoldPrice(goldPrice: {
  karatName: string;
  pricePerGram: number;
  effectiveDate: string;
  isActive: boolean;
}): Promise<AdminGoldPrice> {
  const response = await publicApi.post<AdminGoldPrice>('/gold-price', goldPrice);
  return response.data;
}

export async function adminUpdateGoldPrice(
  id: number, 
  goldPrice: Partial<AdminGoldPrice>
): Promise<AdminGoldPrice> {
  const response = await publicApi.put<AdminGoldPrice>(`/gold-price/${id}`, goldPrice);
  return response.data;
}

export async function adminDeleteGoldPrice(id: number): Promise<void> {
  await publicApi.delete(`/gold-price/${id}`);
}

//----------------------- admin manage reservations --------------------
export interface ReservationItemDetail {
  id: number;
  item: {
    id: number;
    code: string;
    name: string;
    description: string;
    category: { id: number; name: string; description: string };
    karat: { id: number; name: string; displayName: string };
    imageUrl: string;
    weight: number;
    factoryPrice: number;
    goldPricePerGram: number;
    priceBeforeDiscount: number;
    inStockCount: number;
    reservedCount: number;
    isActive: boolean;
  };
  quantity: number;
}

export interface AdminReservation {
  id: number;
  createdAt: string;
  items: ReservationItemDetail[];
  phoneNumber: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'CLOSED';
  totalPrice: number;
  username: string;
}

export interface AdminReservationsResponse {
  content: AdminReservation[];
  page: PageMeta;
}

export async function adminFetchReservations(params: {
  page?: number;
  size?: number;
}): Promise<AdminReservationsResponse> {
  const { page = 0, size = 20 } = params;
  const response = await publicApi.get<AdminReservationsResponse>('/reservations', {
    params: { page, size },
  });
  return response.data;
}

export async function adminGetReservationById(id: number): Promise<AdminReservation> {
  const response = await publicApi.get<AdminReservation>(`/reservations/${id}`);
  return response.data;
}

export async function adminUpdateReservationStatus(id: number, status: string): Promise<void> {
  await publicApi.patch(`/reservations/${id}`, null, {
    params: { status },
  });
}

//-------------------------- admin discount management -------------------
export interface AdminDiscountItem {
  id: number;
  code: string;
  name: string;
  description: string;
  imageUrl: string;
  weight: number;
  inStockCount: number;
  reservedCount: number;
  factoryPrice: number;
  priceBeforeDiscount: number | null;
  priceAfterDiscount: number | null;
  discountPercentage: number | null;
  goldPricePerGram: number | null;
  karat: {
    id: number;
    name: string;
    displayName: string;
  };
  category: {
    id: number;
    name: string;
    description: string;
    imageUrl: string | null;
  };
}

export interface AdminDiscount {
  id: number;
  percentage: number;
  startDate: string; // ISO datetime
  endDate: string;   // ISO datetime
  isActive: boolean;
  items: AdminDiscountItem[];
}

export interface AdminDiscountsResponse {
  content: AdminDiscount[];
  page: PageMeta;
}

// Get paginated discounts
export async function adminFetchDiscounts(params: {
  page?: number;
  size?: number;
}) {
  const { page = 0, size = 20 } = params;
  const response = await publicApi.get<AdminDiscountsResponse>("/discounts", {
    params: { page, size },
  });
  return response.data;
}

// Create discount (with initial itemCodes)
export async function adminCreateDiscount(payload: {
  percentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  itemCodes: string[];
}) {
  const response = await publicApi.post<AdminDiscount>("/discounts", payload);
  return response.data;
}

// Update discount core fields
export async function adminUpdateDiscount(id: number, payload: {
  percentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}) {
  const response = await publicApi.put<AdminDiscount>(`/discounts/${id}`, payload);
  return response.data;
}

// Delete discount
export async function adminDeleteDiscount(id: number) {
  await publicApi.delete(`/discounts/${id}`);
}

// Add items to discount
export async function adminAddItemsToDiscount(discountId: number, itemCodes: string[]) {
  const response = await publicApi.post<AdminDiscount>(
    `/discounts/${discountId}/items`,
    itemCodes
  );
  return response.data;
}

// Remove items from discount
export async function adminRemoveItemsFromDiscount(discountId: number, itemCodes: string[]) {
  const response = await publicApi.delete<AdminDiscount>(
    `/discounts/${discountId}/items`,
    { data: itemCodes }
  );
  return response.data;
}
