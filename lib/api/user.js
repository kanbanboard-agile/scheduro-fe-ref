import { apiRequest } from '../apiFetch';

// Fungsi khusus untuk registrasi
export async function registerUser(payload) {
  return apiRequest({
    endpoint: '/public/register',
    method: 'POST',
    payload,
    isMultipart: payload instanceof FormData,
  });
}

// Fungsi untuk login
export async function loginUser(payload) {
  return apiRequest({
    endpoint: '/public/login',
    method: 'POST',
    payload,
  });
}

// Fungsi untuk mendapatkan data pengguna berdasarkan ID
export async function getUserById(id) {
  return apiRequest({
    endpoint: `/public/users/${id}`,
    method: 'GET',
    credentials: 'include',
  });
}

// Fungsi untuk mendapatkan data pengguna yang sedang login
export async function getMe() {
  return apiRequest({
    endpoint: '/public/me',
    method: 'GET',
    credentials: 'include',
  });
}

// Fungsi untuk memperbarui data pengguna
export async function updateUser(id, payload) {
  return apiRequest({
    endpoint: `/public/users/${id}`,
    method: 'PUT',
    payload,
    credentials: 'include',
    isMultipart: payload instanceof FormData,
  });
}

// Fungsi untuk menghapus pengguna
export async function deleteUser(id) {
  return apiRequest({
    endpoint: `/public/users/${id}`,
    method: 'DELETE',
    credentials: 'include',
  });
}

// Fungsi untuk meminta reset password
export async function requestResetPassword(payload) {
  return apiRequest({
    endpoint: '/public/reset-password',
    method: 'POST',
    payload,
  });
}

// Fungsi untuk verifikasi OTP reset password
export async function verifyOTP(payload) {
  return apiRequest({
    endpoint: '/public/reset-password/verify-otp',
    method: 'POST',
    payload,
  });
}

// Fungsi untuk konfirmasi reset password
export async function confirmResetPassword(payload) {
  return apiRequest({
    endpoint: '/public/reset-password/confirm',
    method: 'POST',
    payload,
  });
}

// Fungsi untuk autentikasi Google (mobile)
export async function googleMobileAuth(payload) {
  return apiRequest({
    endpoint: '/public/auth/google/mobile',
    method: 'POST',
    payload,
  });
}

// Fungsi untuk memperbarui nomor telepon
export async function updateUserNumber(id, payload) {
  return apiRequest({
    endpoint: `/public/users/${id}/update-number`,
    method: 'PUT',
    payload,
    credentials: 'include',
  });
}
