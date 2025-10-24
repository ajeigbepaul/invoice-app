import { ApiResponse } from "@/types/api";

const API_BASE_URL = "/api";

export class ApiClientError extends Error {
  status?: number;
  validationErrors?: any[];

  constructor(message: string, status?: number, validationErrors?: any[]) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.validationErrors = validationErrors;
  }
}

/**
 * Generic API request handler with automatic cookie-based authentication
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      const validationErrors = Array.isArray(data.data) ? data.data : undefined;
      throw new ApiClientError(
        data.error || data.message || "An error occurred",
        response.status,
        validationErrors
      );
    }

    if (!data.success) {
      const validationErrors = Array.isArray(data.data) ? data.data : undefined;
      throw new ApiClientError(
        data.error || data.message || "Request failed",
        undefined,
        validationErrors
      );
    }

    return data.data as T;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError("Network error. Please check your connection.");
  }
}

// API methods
export const api = {
  // Invoice endpoints
  invoices: {
    getAll: (status?: string) => {
      const query = status ? `?status=${status}` : "";
      return apiRequest<any[]>(`/invoices${query}`);
    },

    getById: (id: string) => {
      return apiRequest<any>(`/invoices/${id}`);
    },

    create: (data: any) => {
      return apiRequest<any>("/invoices", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    update: (id: string, data: any) => {
      return apiRequest<any>(`/invoices/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    delete: (id: string) => {
      return apiRequest<void>(`/invoices/${id}`, {
        method: "DELETE",
      });
    },

    markAsPaid: (id: string) => {
      return apiRequest<any>(`/invoices/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "paid" }),
      });
    },
  },

  // Auth endpoints
  auth: {
    register: (data: { email: string; password: string; name: string }) => {
      return apiRequest<any>("/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  },
};
