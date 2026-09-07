const SUPABASE_URL = "https://ysvqvrskwyyjbeepbyuc.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzdnF2cnNrd3l5amJlZXBieXVjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzM4NDU2NiwiZXhwIjoyMTAyOTYwNTY2fQ.zoIHnHM5KHp49TW5Mctue-95s1IUfyC3GE_W2w24EhU";

async function run() {
  const targetBucket = "profile-photos";
  console.log("Listing files in bucket:", targetBucket);
  
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${targetBucket}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prefix: '58220696-96be-417c-b9d5-ffd952cc7d5a/',
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' }
    })
  });
  
  if (!res.ok) {
    console.error("Failed to list objects:", await res.text());
    return;
  }
  
  const files = await res.json();
  console.log("Objects in root:");
  console.log(files);
}
run();
