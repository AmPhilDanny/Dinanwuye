const API_BASE = (
  import.meta.env.VITE_API_URL || 'https://dinanwuye-api.onrender.com'
).replace(/\/+$/, '');

export function photoUrl(s3Key, fallbackName) {
  if (!s3Key) return fallbackName || null;
  if (s3Key.startsWith('data:') || s3Key.startsWith('http')) return s3Key;
  return `${API_BASE}/uploads/photos/${encodeURIComponent(s3Key)}`;
}
