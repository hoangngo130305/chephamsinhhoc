/**
 * API Client for EBGreentek Backend
 * Centralized API calls with JWT authentication
 */

const API_BASE_URL = "http://127.0.0.1:8000/api";

// ============================================================
// TOKEN MANAGEMENT
// ============================================================

export const getToken = (): string | null => {
  return localStorage.getItem('adminToken');
};

export const setToken = (token: string): void => {
  localStorage.setItem('adminToken', token);
  console.log('✅ Token saved to localStorage');
};

export const clearToken = (): void => {
  localStorage.removeItem('adminToken');
  console.log('🗑️ Token cleared from localStorage');
};

/**
 * Decode JWT token and get payload
 */
export const decodeToken = (token: string): any | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('❌ Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  
  const currentTime = Date.now() / 1000;
  const bufferTime = 60; // 60 seconds buffer before actual expiry
  
  return decoded.exp < (currentTime + bufferTime);
};

/**
 * Get token expiry time
 */
export const getTokenExpiry = (token: string): Date | null => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return null;
  }
  return new Date(decoded.exp * 1000);
};

// ============================================================
// HEADERS
// ============================================================

export const getAuthHeaders = async (): Promise<HeadersInit> => {
  let token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    // Check if token is expired
    if (isTokenExpired(token)) {
      console.warn('⚠️ Token is expired, refreshing...');
      const newToken = await refreshAccessToken();
      if (newToken) {
        token = newToken;
        console.log('✅ Using refreshed token');
      } else {
        console.error('❌ Could not refresh token');
        clearToken();
        return headers;
      }
    }
    
    headers['Authorization'] = `Bearer ${token}`;
    console.log('🔑 Auth header added with token');
  } else {
    console.warn('⚠️ No token found in localStorage');
  }
  
  return headers;
};

// ============================================================
// AUTHENTICATION
// ============================================================

export const login = async (username: string, password: string) => {
  console.log("📤 Sending login request to:", `${API_BASE_URL}/token/`);

  const response = await fetch(`${API_BASE_URL}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const raw = await response.text();
  console.log("📥 Raw response:", raw);

  let data: any = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error("❌ JSON parse error:", err);
    throw new Error("Invalid response from server");
  }

  if (!response.ok) {
    console.error("❌ Login failed:", data);
    throw new Error(data.detail || "Login failed");
  }

  // Save tokens
  if (data.access) {
    setToken(data.access);
  }
  if (data.refresh) {
    localStorage.setItem('adminRefreshToken', data.refresh);
  }

  console.log("✅ Login successful");
  return data;
};

export const logout = () => {
  clearToken();
  localStorage.removeItem('adminRefreshToken');
  console.log("👋 Logged out");
};

// ============================================================
// TOKEN REFRESH
// ============================================================

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('adminRefreshToken');
};

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];
let isRedirecting = false; // Prevent infinite redirect loop

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    console.error('❌ No refresh token available');
    return null;
  }
  
  try {
    console.log('🔄 Refreshing access token...');
    
    const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    if (!response.ok) {
      console.error('❌ Token refresh failed');
      clearToken();
      localStorage.removeItem('adminRefreshToken');
      return null;
    }
    
    const data = await response.json();
    
    if (data.access) {
      setToken(data.access);
      console.log('��� Access token refreshed successfully');
      return data.access;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error refreshing token:', error);
    clearToken();
    localStorage.removeItem('adminRefreshToken');
    return null;
  }
};

// ============================================================
// GENERIC API CALL
// ============================================================

interface ApiOptions extends RequestInit {
  requireAuth?: boolean;
}

export const apiCall = async <T = any>(
  endpoint: string,
  options: ApiOptions = {},
  retryCount = 0
): Promise<T> => {
  const { requireAuth = true, ...fetchOptions } = options;
  
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = requireAuth 
    ? await getAuthHeaders() 
    : { 'Content-Type': 'application/json' };
  
  console.log(`🔄 API Call: ${fetchOptions.method || 'GET'} ${url}`);
  
  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      ...headers,
      ...fetchOptions.headers,
    },
  });
  
  // Handle 401 - Token expired, try to refresh
  if (response.status === 401 && requireAuth && retryCount === 0) {
    console.warn('⚠️ 401 Unauthorized - Attempting to refresh token...');
    
    // If already refreshing, wait for it
    if (isRefreshing) {
      console.log('⏳ Token refresh already in progress, waiting...');
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newToken: string) => {
          console.log('✅ Retrying request with new token');
          // Retry the original request with new token
          apiCall<T>(endpoint, options, retryCount + 1)
            .then(resolve)
            .catch(reject);
        });
      });
    }
    
    // Start refreshing
    isRefreshing = true;
    const newToken = await refreshAccessToken();
    isRefreshing = false;
    
    if (newToken) {
      // Notify all waiting requests
      onTokenRefreshed(newToken);
      
      // Retry the original request
      console.log('✅ Token refreshed, retrying original request');
      return apiCall<T>(endpoint, options, retryCount + 1);
    } else {
      // Refresh failed, clear tokens and throw error
      console.error('❌ Token refresh failed - Please login again');
      clearToken();
      localStorage.removeItem('adminRefreshToken');
      
      // Redirect to login if in browser (only once to prevent infinite loop)
      if (typeof window !== 'undefined' && !isRedirecting) {
        isRedirecting = true;
        console.log('🔄 Redirecting to login page...');
        
        // Small delay to allow logs to be seen
        setTimeout(() => {
          window.location.href = '/admin';
        }, 100);
      }
      
      throw new Error('Session expired - Please login again');
    }
  }
  
  // Handle other errors
  if (!response.ok) {
    const errorText = await response.text();
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { detail: errorText };
    }
    console.error(`❌ HTTP ${response.status}:`, errorData);
    console.error(`❌ Full error details:`, JSON.stringify(errorData, null, 2));
    throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
  }
  
  // Parse response
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    console.log(`✅ Response received:`, data);
    return data;
  }
  
  return {} as T;
};

// ============================================================
// PRODUCTS API
// ============================================================

export const getProducts = async () => {
  return apiCall('/products/?status=active');
};

export const getProduct = async (id: string) => {
  return apiCall(`/products/${id}/`);
};

export const createProduct = async (productData: any) => {
  return apiCall('/products/', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
};

export const updateProduct = async (id: string, productData: any) => {
  return apiCall(`/products/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
};

export const deleteProduct = async (id: string) => {
  return apiCall(`/products/${id}/`, {
    method: 'DELETE',
  });
};

// ============================================================
// ARTICLES API
// ============================================================

export const getArticles = async () => {
  return apiCall('/articles/');
};

export const getArticle = async (id: string) => {
  return apiCall(`/articles/${id}/`);
};

export const createArticle = async (articleData: any) => {
  return apiCall('/articles/', {
    method: 'POST',
    body: JSON.stringify(articleData),
  });
};

export const updateArticle = async (id: string, articleData: any) => {
  return apiCall(`/articles/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(articleData),
  });
};

export const deleteArticle = async (id: string) => {
  return apiCall(`/articles/${id}/`, {
    method: 'DELETE',
  });
};

// ============================================================
// CONTACTS API
// ============================================================

export const getContacts = async () => {
  return apiCall('/contacts/');
};

export const getContact = async (id: string) => {
  return apiCall(`/contacts/${id}/`);
};

export const createContact = async (contactData: any) => {
  return apiCall('/contacts/', {
    method: 'POST',
    body: JSON.stringify(contactData),
    requireAuth: false, // Public can create contacts
  });
};

export const replyContact = async (id: string, reply: string) => {
  return apiCall(`/contacts/${id}/reply/`, {
    method: 'POST',
    body: JSON.stringify({ admin_reply: reply }),
  });
};

export const deleteContact = async (id: string) => {
  return apiCall(`/contacts/${id}/`, {
    method: 'DELETE',
  });
};

// ============================================================
// SETTINGS API
// ============================================================

export const getSettings = async () => {
  return apiCall('/settings/');
};

export const getSettingsPublic = async () => {
  return apiCall('/settings/public/', {
    requireAuth: false,
  });
};

export const updateSettings = async (settingsData: any) => {
  console.log('🔧 [API] updateSettings called with:', settingsData);
  
  // Flatten nested settings object to match backend format
  const flatSettings: Record<string, string> = {};
  
  const flatten = (obj: any, prefix = '') => {
    for (const key in obj) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        // Nested object - recurse
        flatten(value, newKey);
      } else {
        // Leaf value - convert to string
        let stringValue: string;
        
        if (Array.isArray(value)) {
          // Arrays should be JSON stringified
          stringValue = JSON.stringify(value);
        } else if (typeof value === 'string') {
          stringValue = value;
        } else if (value === null || value === undefined) {
          // Skip null/undefined values - don't send to backend
          continue;
        } else {
          // Numbers, booleans, etc.
          stringValue = String(value);
        }
        
        // Skip empty strings - backend doesn't accept blank values
        if (stringValue === '') {
          continue;
        }
        
        flatSettings[newKey] = stringValue;
      }
    }
  };
  
  flatten(settingsData);
  
  console.log('📤 [API] Flattened settings:', flatSettings);
  
  const payload = { settings: flatSettings };
  console.log('📦 [API] Sending payload:', payload);
  
  return apiCall('/settings/bulk_update/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

// ============================================================
// STATS/ANALYTICS API
// ============================================================

export const getStats = async () => {
  return apiCall('/stats/');
};

export const getActivityLogs = async () => {
  return apiCall('/activity-logs/');
};

// ============================================================
// FILE UPLOAD
// ============================================================

export const uploadFile = async (file: File, type: 'image' | 'document' = 'image') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  const token = getToken();
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  console.log(`📤 Uploading file: ${file.name}`);
  
  const response = await fetch(`${API_BASE_URL}/upload/`, {
    method: 'POST',
    headers,
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log(`✅ File uploaded:`, data);
  return data;
};
