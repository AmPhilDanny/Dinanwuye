/**
 * Dinanwuye — Database seed script (compiled from seed.ts)
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();

function randomDate(yearStart, yearEnd) {
  const start = new Date(yearStart, 0, 1).getTime();
  const end = new Date(yearEnd, 11, 31).getTime();
  return new Date(start + Math.random() * (end - start));
}

const DEMO_PROFILES = [
  { email: 'demo@dinanwuye.com', name: 'Amara', gender: 'female', seeking: ['male'], bio: 'Lagos-based architect who loves jazz and weekend road trips.', interests: ['architecture', 'jazz', 'travel', 'cooking'], languages: ['English', 'Igbo'], locationName: 'Lagos, Nigeria', lat: 6.5244, lng: 3.3792 },
  { email: 'chidi@dinanwuye.com', name: 'Chidi', gender: 'male', seeking: ['female'], bio: 'Software engineer. Fueled by jollof rice and Afrobeats.', interests: ['coding', 'football', 'music', 'photography'], languages: ['English', 'Igbo'], locationName: 'Enugu, Nigeria', lat: 6.4413, lng: 7.4988 },
  { email: 'nneka@dinanwuye.com', name: 'Nneka', gender: 'female', seeking: ['male'], bio: 'Doctor by day, bookworm by night.', interests: ['medicine', 'reading', 'yoga', 'hiking'], languages: ['English', 'Igbo', 'Yoruba'], locationName: 'Abuja, Nigeria', lat: 9.0579, lng: 7.4951 },
  { email: 'emeka@dinanwuye.com', name: 'Emeka', gender: 'male', seeking: ['female'], bio: 'Photographer capturing the beauty of West Africa.', interests: ['photography', 'travel', 'cinema', 'cooking'], languages: ['English', 'Igbo'], locationName: 'Port Harcourt, Nigeria', lat: 4.8156, lng: 7.0498 },
  { email: 'fatima@dinanwuye.com', name: 'Fatima', gender: 'female', seeking: ['male'], bio: 'Entrepreneur building the next big thing from Accra.', interests: ['business', 'tech', 'fashion', 'music'], languages: ['English', 'Hausa', 'French'], locationName: 'Accra, Ghana', lat: 5.6037, lng: -0.187 },
  { email: 'tunde@dinanwuye.com', name: 'Tunde', gender: 'male', seeking: ['female'], bio: 'Lagos nightlife connoisseur. Part-time DJ.', interests: ['music', 'DJing', 'fitness', 'food'], languages: ['English', 'Yoruba'], locationName: 'Lagos, Nigeria', lat: 6.5244, lng: 3.3792 },
  { email: 'adaeze@dinanwuye.com', name: 'Adaeze', gender: 'female', seeking: ['male'], bio: 'Lawyer who loves to dance and explore new cuisines.', interests: ['law', 'dancing', 'cuisine', 'movies'], languages: ['English', 'Igbo'], locationName: 'Kano, Nigeria', lat: 12.0, lng: 8.5167 },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@dinanwuye.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
  console.log('🌱  Seeding database …');

  const adminHash = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Super Admin',
      passwordHash: adminHash,
      role: 'super_admin',
      permissions: ['users:read', 'users:write', 'profiles:read', 'profiles:write', 'reports:read', 'reports:write', 'admin:read', 'admin:write'],
    },
  });
  console.log(`  ✅  Admin user: ${admin.email} (${admin.role})`);

  for (const p of DEMO_PROFILES) {
    const passwordHash = await bcrypt.hash('Password123!', 10);
    const user = await prisma.user.upsert({
      where: { email: p.email },
      update: {},
      create: {
        email: p.email,
        passwordHash,
        status: 'active',
        role: 'user',
        isVerified: true,
      },
    });

    const existingProfile = await prisma.profile.findUnique({ where: { userId: user.id } });
    if (existingProfile) {
      console.log(`  ⏭️   ${p.name} — profile exists, skipping`);
      continue;
    }

    await prisma.profile.create({
      data: {
        userId: user.id,
        name: p.name,
        dob: randomDate(1990, 2002),
        gender: p.gender,
        seeking: p.seeking,
        bio: p.bio,
        interests: p.interests,
        languages: p.languages,
        locationName: p.locationName,
        locationLat: p.lat,
        locationLng: p.lng,
        isVerified: true,
        onboardingComplete: true,
        photos: {
          create: { s3Key: `demo/${p.name.toLowerCase()}.jpg`, order: 0, moderationStatus: 'approved' },
        },
        preferences: {
          create: { ageMin: 21, ageMax: 40, distanceKm: 50 },
        },
      },
    });
    console.log(`  ✅  ${p.name} — profile created (${p.gender}, ${p.locationName})`);
  }

  console.log('🌱  Seed complete.');
}

main()
  .catch((e) => {
    console.error('❌  Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
