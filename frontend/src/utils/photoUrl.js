const API_BASE = (
  import.meta.env.VITE_API_URL || 'https://dinanwuye-api.onrender.com'
).replace(/\/+$/, '');

export function photoUrl(s3Key, fallbackName) {
  if (!s3Key) return fallbackName || null;
  if (s3Key.startsWith('http')) return s3Key;
  if (s3Key.startsWith('data:')) return s3Key; // legacy base64 seed data
  return `${API_BASE}/uploads/photos/${encodeURIComponent(s3Key)}`;
}
