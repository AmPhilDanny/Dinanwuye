const { PrismaClient } = require('./backend/consolidated-app/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const profileId = '58220696-96be-417c-b9d5-ffd952cc7d5a'; // it's actually userId
  const photos = await prisma.photo.findMany({
    where: { profile: { userId: profileId } }
  });
  console.log("Photos for user", profileId);
  console.log(photos);
  
  const user = await prisma.profile.findUnique({
    where: { userId: profileId },
    include: { photos: true }
  });
  console.log("User:", user?.name);
}

main().finally(() => prisma.$disconnect());
