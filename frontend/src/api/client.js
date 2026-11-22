const API_BASE = '/api';

/**
 * Get the locally stored Gemini API key (if entered by user in UI)
 */
export function getSavedGeminiKey() {
  return localStorage.getItem('gemini_api_key') || '';
}

/**
 * Save custom Gemini API key in localStorage
 */
export function saveGeminiKey(key) {
  if (key && key.trim()) {
    localStorage.setItem('gemini_api_key', key.trim());
  } else {
    localStorage.removeItem('gemini_api_key');
  }
}

/**
 * Check backend health & Gemini status
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      error: err.message
    };
  }
}

/**
 * Send resume PDF and job description to the backend REST API
 */
export async function analyzeResume({ file, jobTitle, jobDescription, customApiKey }) {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('jobDescription', jobDescription);
  if (jobTitle) {
    formData.append('jobTitle', jobTitle);
  }

  const apiKey = customApiKey || getSavedGeminiKey();
  const headers = {};
  if (apiKey) {
    headers['x-gemini-api-key'] = apiKey;
  }

  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers,
    body: formData
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    const errMessage = data?.error?.message || `Analysis failed with status ${response.status}`;
    const error = new Error(errMessage);
    error.statusCode = response.status;
    error.code = data?.error?.code;
    throw error;
  }

  return data.data;
}

/**
 * Retrieve recent analyses
 */
export async function getAnalysisHistory(limit = 20) {
  const response = await fetch(`${API_BASE}/history?limit=${limit}`);
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data?.error?.message || 'Failed to fetch history');
  }
  return data.data;
}

/**
 * Delete an analysis record
 */
export async function deleteAnalysisRecord(id) {
  const response = await fetch(`${API_BASE}/history/${id}`, {
    method: 'DELETE'
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data?.error?.message || 'Failed to delete record');
  }
  return data;
}
