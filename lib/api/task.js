import { apiRequest } from '../apiFetch';

export async function getUserTasks(userId) {
  return apiRequest({
    endpoint: `/tasks/user/${userId}`,
    method: 'GET',
    credentials: 'include',
  });
}

export async function createTask(payload) {
  return apiRequest({
    endpoint: '/tasks/create',
    method: 'POST',
    payload,
    credentials: 'include',
  });
}

export async function updateTask(payload) {
  return apiRequest({
    endpoint: `/tasks/${payload.id}`,
    credentials: 'include',
    method: 'PUT',
    payload,
  });
}

export async function deleteTask(payload) {
  return apiRequest({
    endpoint: `/tasks/${payload.id}`,
    credentials: 'include',
    method: 'DELETE',
    payload,
  });
}

export async function getTaskDetail(id) {
  return apiRequest({
    endpoint: `/tasks/${id}`,
    credentials: 'include',
    method: 'GET',
  });
}

export async function getTaskByWorkspace(workspaceId) {
  return apiRequest({
    endpoint: `/tasks/workspaces/${workspaceId}`,
    credentials: 'include',
    method: 'GET',
  });
}

export async function getTasksByStatus(status) {
  return apiRequest({
    endpoint: `/tasks/status/${status}`,
    method: 'GET',
    credentials: 'include',
  });
}
