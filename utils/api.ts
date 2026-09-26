const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Check if backend is available
const checkBackendAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000), // 2 second timeout
    });
    return response.ok;
  } catch {
    return false;
  }
};

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Backend server is not available. Please start the backend server or use demo mode.');
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    return data;
  },
  register: async (name: string, email: string, password: string) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },
  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await apiRequest('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    return apiRequest('/users');
  },
  getById: async (id: string) => {
    return apiRequest(`/users/${id}`);
  },
  create: async (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    department?: string;
    whatsapp?: string;
    status?: string;
  }) => {
    return apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  update: async (id: string, userData: {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    department?: string;
    whatsapp?: string;
    status?: string;
  }) => {
    return apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
  delete: async (id: string) => {
    return apiRequest(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// Items API
export const itemsAPI = {
  getAll: async (search?: string, page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/items${query}`);
  },
  getById: async (id: string) => {
    return apiRequest(`/items/${id}`);
  },
  create: async (itemData: { name: string; description?: string }) => {
    return apiRequest('/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },
  update: async (id: string, itemData: { name?: string; description?: string }) => {
    return apiRequest(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  },
  delete: async (id: string) => {
    return apiRequest(`/items/${id}`, {
      method: 'DELETE',
    });
  },
};

// Medicines API (Section 16)
export const medicinesAPI = {
  getAll: async () => apiRequest('/medicines'),
  getById: async (id: string) => apiRequest(`/medicines/${id}`),
  create: async (data: any) => apiRequest('/medicines', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id: string, data: any) => apiRequest(`/medicines/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id: string) => apiRequest(`/medicines/${id}`, { method: 'DELETE' }),
};

// Inventory API
export const inventoryAPI = {
  getAll: async () => apiRequest('/inventory'),
  getByFacility: async (facilityId: string) => apiRequest(`/inventory/${facilityId}`),
};

// Predictions API
export const predictionsAPI = {
  getAll: async () => apiRequest('/predictions'),
  getByMedicineId: async (id: string) => apiRequest(`/predictions/${id}`),
};

// Analytics API
export const analyticsAPI = {
  getConsumption: async () => apiRequest('/analytics/consumption'),
};

// Redistribution API
export const redistributionAPI = {
  getRecommendations: async () => apiRequest('/redistribution/recommendations'),
  approve: async (id: string) => apiRequest(`/redistribution/recommendations/${id}/approve`, { method: 'POST' }),
  reject: async (id: string) => apiRequest(`/redistribution/recommendations/${id}/reject`, { method: 'POST' }),
};

// Facilities API
export const facilitiesAPI = {
  getAll: async () => apiRequest('/facilities'),
};

// Alerts API
export const alertsAPI = {
  getAll: async () => apiRequest('/alerts'),
  update: async (id: string, data: any) => apiRequest(`/alerts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};


