import { apiRequest } from '../apiFetch';
import Cookies from 'js-cookie'; // Add this import at the top
export async function getUserWorkspaces(userId) {
  return apiRequest({
    endpoint: `/workspaces/users/${userId}/workspaces`,
    method: 'GET',
    credentials: 'include',
  });
}

export async function createWorkspace(payload) {
  return apiRequest({
    endpoint: '/workspaces/create',
    method: 'POST',
    payload,
    credentials: 'include',
  });
}

export const getWorkspaceDetail = async (slug) => {
  return await apiRequest({
    endpoint: `/workspaces/slug/${slug}`,
    credentials: 'include',
    method: 'GET',
  });
};

export async function getWorkspaceById(id) {
  return apiRequest({
    endpoint: `/workspaces/${id}`,
    credentials: 'include',
    method: 'GET',
  });
}

// In workspace.js
export async function updateWorkspace({ id, name, priority, logo }) {
  // Handle file uploads differently from regular JSON data
  if (logo instanceof File) {
    // Create FormData for file upload
    const formData = new FormData();

    // Always include these fields to prevent "No data provided" error
    formData.append('name', name || 'Workspace');
    formData.append('priority', priority || 'Normal');
    formData.append('logo', logo);

    // Get base URL and token
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
    const token = Cookies.get('token')?.trim();

    // Make a direct fetch call that properly handles FormData
    const response = await fetch(`${baseUrl}/workspaces/${id}`, {
      method: 'PUT',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update workspace');
    }

    return data;
  } else {
    // For regular updates (no file), use the existing apiRequest function
    return apiRequest({
      endpoint: `/workspaces/${id}`,
      method: 'PUT',
      payload: { name, priority },
    });
  }
}

export async function deleteWorkspace(payload) {
  return apiRequest({
    endpoint: `/workspaces/${payload.id}`,
    credentials: 'include',
    method: 'DELETE',
    payload,
  });
}
