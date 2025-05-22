/**
 * Utility function để tạo API client với headers xác thực tự động
 */

// Base URL cho API
const API_BASE_URL = 'http://localhost:8000';

// Tạo các options mặc định cho fetch
const createDefaultOptions = (customOptions: RequestInit = {}): RequestInit => {
  // Lấy token từ localStorage
  const token = localStorage.getItem('token');
  
  // Tạo headers mặc định
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(customOptions.headers || {})
  };
  
  // Trả về options với headers đã được merge
  return {
    ...customOptions,
    headers
  };
};

// Hàm GET
export const apiGet = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, createDefaultOptions({
    method: 'GET',
    ...options
  }));
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// Hàm POST
export const apiPost = async <T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, createDefaultOptions({
    method: 'POST',
    body: JSON.stringify(data),
    ...options
  }));
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// Hàm PUT
export const apiPut = async <T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, createDefaultOptions({
    method: 'PUT',
    body: JSON.stringify(data),
    ...options
  }));
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// Hàm DELETE
export const apiDelete = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, createDefaultOptions({
    method: 'DELETE',
    ...options
  }));
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// Hàm tạo query string từ params
export const createQueryString = (params: Record<string, any>): string => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });
  
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

export default {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
  createQueryString
}; 