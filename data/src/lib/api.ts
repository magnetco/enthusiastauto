const API_BASE = '/api'

export async function fetchData<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`)
  }
  return response.json()
}

export async function updateField(
  endpoint: string,
  id: string,
  field: string,
  value: string
): Promise<void> {
  const response = await fetch(`${API_BASE}${endpoint}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ field, value }),
  })
  if (!response.ok) {
    throw new Error(`Failed to update ${field}`)
  }
}

export async function deleteRecord(endpoint: string, id: string): Promise<void> {
  const response = await fetch(`${API_BASE}${endpoint}/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error(`Failed to delete record`)
  }
}

export async function postData<T>(endpoint: string, data: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || 'Request failed')
  }
  return response.json()
}

