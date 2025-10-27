/**
 * Check if backend is available
 */
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return { available: true, data };
    }
    
    return { available: false, error: `HTTP ${response.status}` };
  } catch (error) {
    return { available: false, error: error.message };
  }
};

/**
 * Check if analytics API is available
 */
export const checkAnalyticsAPI = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_API_KEY || 'your-api-key-for-authentication',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return { available: true, data };
    }
    
    return { available: false, error: `HTTP ${response.status}` };
  } catch (error) {
    return { available: false, error: error.message };
  }
};
