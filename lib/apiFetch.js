import Cookies from 'js-cookie';

// Fungsi utilitas untuk request API
export async function apiRequest({ endpoint, method = 'POST', payload = null, headers = {} }) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      throw new Error('API base URL is not defined');
    }

    // Ambil token dari cookies
    const token = Cookies.get('token')?.trim();

    // Menyiapkan konfigurasi request
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...(payload && { body: JSON.stringify(payload) }),
    };

    // Jika token ditemukan, tambahkan Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Menambahkan payload jika ada
    if (payload) {
      config.body = JSON.stringify(payload);
    } else if (config.body) {
      // Jika body sudah diatur secara langsung, gunakan body
      config.body = JSON.stringify(config.body);
    }

    // Lakukan permintaan API
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
