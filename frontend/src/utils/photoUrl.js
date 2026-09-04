const API_BASE = (
  import.meta.env.VITE_API_URL || 'https://dinanwuye-api.onrender.com'
).replace(/\/+$/, '');

export function photoUrl(s3Key, fallbackName) {
  if (!s3Key) return fallbackName || null;
  if (s3Key.startsWith('http')) return s3Key;
  if (s3Key.startsWith('data:')) return s3Key;
  const parts = s3Key.split('/');
  if (parts.length >= 2) {
    const userId = parts[0];
    const filename = parts.slice(1).join('/');
    return `${API_BASE}/api/v1/profiles/photo-proxy/${userId}/${filename}`;
  }
  return null;
}
