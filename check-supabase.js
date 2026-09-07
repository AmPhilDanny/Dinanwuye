const SUPABASE_URL = "https://ysvqvrskwyyjbeepbyuc.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzdnF2cnNrd3l5amJlZXBieXVjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzM4NDU2NiwiZXhwIjoyMTAyOTYwNTY2fQ.zoIHnHM5KHp49TW5Mctue-95s1IUfyC3GE_W2w24EhU";

async function run() {
  // Check if bucket exists
  const res = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    headers: { Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` }
  });
  if (!res.ok) {
    console.error("Failed to list buckets", await res.text());
    return;
  }
  const buckets = await res.json();
  console.log("Buckets:", buckets.map(b => b.id));
  
  const targetBucket = "profile-photos";
  if (!buckets.some(b => b.id === targetBucket)) {
    console.log(`Bucket ${targetBucket} not found. Creating...`);
    const createRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: targetBucket, name: targetBucket, public: true })
    });
    if (!createRes.ok) {
      console.error("Failed to create bucket", await createRes.text());
    } else {
      console.log(`Bucket ${targetBucket} created successfully!`);
    }
  } else {
    console.log(`Bucket ${targetBucket} already exists!`);
    
    // Check if it is public
    const b = buckets.find(b => b.id === targetBucket);
    if (!b.public) {
       console.log("Bucket is not public, updating...");
       const updateRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket/${targetBucket}`, {
         method: 'PUT',
         headers: {
           Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({ public: true })
       });
       if (!updateRes.ok) {
         console.error("Failed to make bucket public", await updateRes.text());
       } else {
         console.log("Bucket is now public.");
       }
    }
  }
}
run();
