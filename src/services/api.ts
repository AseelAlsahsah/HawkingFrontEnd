import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
});

//----------------------------Collection page --------------------
export interface Item {
  id: number;
  code: string;
  name: string;
  description: string;
  arabicName: string;
  arabicDescription: string;
  categoryName: string;
  arabicCategoryName: string;
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
  arabicName: string;
  arabicDescription: string;
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
  category: { name: string; id: number; description: string; arabicName: string; arabicDescription: string};
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

//-------------------------fetch categories ------------------------
export interface AdminCategory {
  id: number;
  name: string;
  description: string;
  arabicName?: string;
  arabicDescription?: string;
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

//----------------------- fetch karats ----------------------
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

//----------------- fetch items by code -------------------
export async function searchItemsByCode(params: {
  query?: string;
  page?: number;
  size?: number;
}) {
  const { query, page = 0, size = 20 } = params;
  return api.get<ItemSearchResponse>("/items/search", {
    params: { 
      code: query || undefined,
      page, 
      size 
    },
  }).then(res => res.data);
}