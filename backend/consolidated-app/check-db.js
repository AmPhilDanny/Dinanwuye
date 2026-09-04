const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const photos = await prisma.photo.findMany();
  console.log("All photos in DB:", photos);
  
  const profiles = await prisma.profile.findMany({ include: { photos: true }});
  console.log("Profiles with photos:", JSON.stringify(profiles, null, 2));
}

check()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
