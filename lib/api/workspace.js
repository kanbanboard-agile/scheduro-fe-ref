import { apiRequest } from "../apiFetch";

export async function getUserWorkspaces(userId) {
  return apiRequest({
    endpoint: `/workspaces/users/${userId}/workspaces`,
    method: "GET",
    credentials: "include",
  });
}

export async function createWorkspace(payload) {
  return apiRequest({
    endpoint: "/workspaces/create",
    method: "POST",
    payload,
    credentials: "include",
  });
}

export const getWorkspaceDetail = async (slug) => {
  return await apiRequest({
    endpoint: `/workspaces/slug/${slug}`,
    credentials: "include",
    method: "GET",
  });
};


export async function getWorkspaceById(id) {
  return apiRequest({
    endpoint: `/workspaces/${id}`,
    credentials: "include",
    method: "GET",
  });
}

export async function updateWorkspace(payload) {
  return apiRequest({
    endpoint: `/workspaces/${payload.id}`,
    credentials: "include",
    method: "PUT",
    payload,
  });
}

export async function deleteWorkspace(payload) {
  return apiRequest({
    endpoint: `/workspaces/${payload.id}`,
    credentials: "include",
    method: "DELETE",
    payload,
  });
}
