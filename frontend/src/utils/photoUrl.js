const SUPABASE_URL = 'https://ysvqvrskwyyjbeepbyuc.supabase.co';
const BUCKET = 'profile-photos';
const PUBLIC_BASE = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}`;

export function photoUrl(s3Key, fallbackName) {
  if (!s3Key) return fallbackName || null;
  if (s3Key.startsWith('http')) return s3Key;
  if (s3Key.startsWith('data:')) return s3Key; // legacy base64 seed data
  return `${PUBLIC_BASE}/${s3Key}`;
}
