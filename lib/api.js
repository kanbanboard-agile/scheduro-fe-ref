// Fungsi utilitas untuk request API
export async function apiRequest({ endpoint, method = 'POST', payload = null, headers = {} }) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
    if (!baseUrl) {
      throw new Error('API base URL is not defined');
    }

    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (payload) {
      config.body = JSON.stringify(payload);
    }

    const response = await fetch(`${baseUrl}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      // Buat error dengan menyertakan data respons dan status
      const error = new Error(data.message || `${method} request failed`);
      error.response = { data, status: response.status };
      throw error;
    }

    return data;
  } catch (error) {
    // Pastikan error asli diteruskan dengan informasi tambahan
    const apiError = new Error(error.message || `An error occurred during ${method} request`);
    apiError.response = error.response || null;
    throw apiError;
  }
}

// Fungsi khusus untuk registrasi
export async function registerUser(payload) {
  return apiRequest({
    endpoint: '/public/register',
    method: 'POST',
    payload,
  });
}

// Fungsi khusus untuk login
export async function loginUser(payload) {
  return apiRequest({
    endpoint: '/public/login',
    method: 'POST',
    payload,
  });
}
