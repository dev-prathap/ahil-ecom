/**
 * API client utilities for handling requests with retry logic and error handling
 */

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  orderId?: string;
  total?: number;
}

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  retryCondition?: (error: any) => boolean;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    retryCondition = (error) => error.status >= 500
  } = retryOptions;

  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const error = new ApiError(
          data.error || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          data.code
        );
        
        // Check if we should retry
        if (attempt < maxRetries && retryCondition(error)) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
          continue;
        }
        
        throw error;
      }

      return data;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // If it's not a network error or we've exhausted retries, throw
      if (attempt >= maxRetries || !retryCondition(lastError)) {
        throw lastError;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
    }
  }

  throw lastError!;
}

export async function submitOrder(orderData: any): Promise<ApiResponse> {
  return apiRequest('/api/submit-order', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }, {
    maxRetries: 2,
    retryDelay: 1000,
    retryCondition: (error) => {
      // Retry on server errors but not on client errors
      return error.status >= 500 || error.name === 'TypeError'; // Network errors
    }
  });
}