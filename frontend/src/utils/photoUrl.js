const SUPABASE_URL = (
  import.meta.env.VITE_SUPABASE_URL || 'https://ysvqvrskwyyjbeepbyuc.supabase.co'
).replace(/\/+$/, '');

const SUPABASE_BUCKET = 'photos';

const API_BASE = (
  import.meta.env.VITE_API_URL || 'https://dinanwuye-api.onrender.com'
).replace(/\/+$/, '');

export function photoUrl(s3Key, fallbackName) {
  if (!s3Key) return fallbackName || null;
  if (s3Key.startsWith('data:') || s3Key.startsWith('http')) return s3Key;
  return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${encodeURIComponent(s3Key)}`;
}
