import axios from "axios";

//----------------------------Collection page --------------------
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

const api = axios.create({
  baseURL: "/api/v1",
});

export async function fetchItems(params: {
  page?: number;
  size?: number;
  name?: string;
  categoryName?: string;
}) {
  const { page = 0, size = 12, categoryName, name } = params;
  const response = await api.get<ItemSearchResponse>("/items/search", {
    params: { page, size, categoryName, name },
  });
  return response.data;
}

//----------------------------get item by code page --------------------
export interface ItemDetail {
  id: number;
  code: string;
  name: string;
  description: string;
  imageUrl: string;
  priceBeforeDiscount: number;
  priceAfterDiscount: number | null;
  goldPricePerGram: number;
  factoryPrice: number;
  discountPercentage: number;
  weight: number;
  inStockCount: number;
  reservedCount: number;
  karat: { displayName: string; id: number; name: string };
  category: { name: string; id: number; description: string };
}

export async function fetchItemByCode(code: string): Promise<ItemDetail> {
  const response = await fetch(`/api/v1/items/${code}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch item: ${response.statusText}`);
  }
  return response.json();
}

// ------------------------ reservation logic --------------------------
export interface ReservationItem {
  itemCode: string;
  quantity: number;
}

export interface ReservationRequest {
  username: string;
  phoneNumber: string;
  totalPrice: number;
  items: ReservationItem[];
}

export async function createReservation(request: ReservationRequest): Promise<any> {
  const response = await fetch('/api/v1/reservations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  
  return response.json();
}


// ------------------- search icon -------------------------
export async function searchItems(params: {
  query?: string;  // Single unified search
  page?: number;
  size?: number;
}) {
  const { query, page = 0, size = 20 } = params;
  return api.get<ItemSearchResponse>("/items/search", {
    params: { 
      name: query || undefined, 
      page, 
      size 
    },
  }).then(res => res.data);
}

// ----------------------- admin items management ----------------------
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
  const response = await api.get<AdminItemsResponse>("/items", {
    params: { page, size, categoryName },
  });
  return response.data;
}

export async function adminGetItemById(id: number) {
  const response = await api.get<AdminItem>(`/items/${id}`);
  return response.data;
}

export async function adminGetItemByCode(code: string) {
  const response = await api.get<AdminItem>(`/items/${code}`);
  return response.data;
}

export async function adminCreateItem(item: Omit<AdminItem, 'id' | 'category' | 'karat' | 'priceBeforeDiscount' | 'priceAfterDiscount' | 'goldPricePerGram' | 'reservedCount'>) {
  const response = await api.post<AdminItem>("/items", item);
  return response.data;
}

export async function adminUpdateItem(id: number, item: Partial<AdminItem>) {
  const response = await api.put<AdminItem>(`/items/${id}`, item);
  return response.data;
}

export async function adminDeleteItem(code: string) { 
  await api.delete(`/items/code/${code}`); 
}

export async function searchItemsByCode(params: {
  query?: string;
  page?: number;
  size?: number;
}) {
  const { query, page = 0, size = 20 } = params;
  return api.get<ItemSearchResponse>("/items/search", {
    params: { 
      code: query || undefined,  // Searches by code parameter
      page, 
      size 
    },
  }).then(res => res.data);
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

export async function adminFetchCategories(params: {
  page?: number;
  size?: number;
}) {
  const { page = 0, size = 20 } = params;
  const response = await api.get<AdminCategoriesResponse>("/category", {
    params: { page, size },
  });
  return response.data;
}

// Get category by ID
export async function adminGetCategoryById(id: number): Promise<AdminCategory> {
  const response = await api.get<AdminCategory>(`/category/${id}`);
  return response.data;
}

// Create category
export async function adminCreateCategory(category: { name: string; description: string }): Promise<AdminCategory> {
  const response = await api.post<AdminCategory>('/category', category);
  return response.data;
}

// Update category
export async function adminUpdateCategory(id: number, category: Partial<AdminCategory>): Promise<AdminCategory> {
  const response = await api.put<AdminCategory>(`/category/${id}`, category);
  return response.data;
}

// Delete category
export async function adminDeleteCategory(id: number): Promise<void> {
  await api.delete(`/category/${id}`);
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

export async function adminFetchKarats(params: {
  page?: number;
  size?: number;
}) {
  const { page = 0, size = 20 } = params;
  const response = await api.get<AdminKaratsResponse>("/karat", {
    params: { page, size },
  });
  return response.data;
}

//-------------------- admin karats ---------------------------
export async function adminGetKaratById(id: number): Promise<AdminKarat> {
  const response = await api.get<AdminKarat>(`/karat/${id}`);
  return response.data;
}

export async function adminCreateKarat(karat: { name: string; displayName: string }): Promise<AdminKarat> {
  const response = await api.post<AdminKarat>('/karat', karat);
  return response.data;
}

export async function adminUpdateKarat(id: number, karat: Partial<AdminKarat>): Promise<AdminKarat> {
  const response = await api.put<AdminKarat>(`/karat/${id}`, karat);
  return response.data;
}

export async function adminDeleteKarat(id: number): Promise<void> {
  await api.delete(`/karat/${id}`);
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
  const response = await api.get<AdminGoldPricesResponse>("/gold-price", {
    params: { page, size },
  });
  return response.data;
}

export async function adminGetGoldPriceById(id: number): Promise<AdminGoldPrice> {
  const response = await api.get<AdminGoldPrice>(`/gold-price/${id}`);
  return response.data;
}

export async function adminCreateGoldPrice(goldPrice: {
  karatName: string;
  pricePerGram: number;
  effectiveDate: string;
  isActive: boolean;
}): Promise<AdminGoldPrice> {
  const response = await api.post<AdminGoldPrice>('/gold-price', goldPrice);
  return response.data;
}

export async function adminUpdateGoldPrice(
  id: number, 
  goldPrice: Partial<AdminGoldPrice>
): Promise<AdminGoldPrice> {
  const response = await api.put<AdminGoldPrice>(`/gold-price/${id}`, goldPrice);
  return response.data;
}

export async function adminDeleteGoldPrice(id: number): Promise<void> {
  await api.delete(`/gold-price/${id}`);
}

//----------------------- admin manage reservations --------------------
// Reservation interfaces
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

// Admin Reservations API functions
export async function adminFetchReservations(params: {
  page?: number;
  size?: number;
}): Promise<AdminReservationsResponse> {
  const { page = 0, size = 20 } = params;
  const response = await api.get<AdminReservationsResponse>('/reservations', {
    params: { page, size },
  });
  return response.data;
}

export async function adminGetReservationById(id: number): Promise<AdminReservation> {
  const response = await api.get<AdminReservation>(`/reservations/${id}`);
  return response.data;
}

export async function adminUpdateReservationStatus(id: number, status: string): Promise<void> {
  await api.patch(`/reservations/${id}`, null, {
    params: { status },
  });
}
