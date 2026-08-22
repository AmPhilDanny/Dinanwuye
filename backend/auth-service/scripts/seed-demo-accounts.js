/**
 * Seed script — creates 4 demo accounts for local dev/testing.
 * Run: node scripts/seed-demo-accounts.js
 *
 * Accounts:
 *  Male 1:   chidi@example.com  / Password123!
 *  Male 2:   emeka@example.com  / Password123!
 *  Female 1: amaka@example.com  / Password123!
 *  Female 2: ngozi@example.com  / Password123!
 */

const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');
const { createHash } = require('crypto');

const prisma = new PrismaClient();

const DEMO_ACCOUNTS = [
  { email: 'chidi@example.com', password: 'Password123!', label: 'Male 1' },
  { email: 'emeka@example.com', password: 'Password123!', label: 'Male 2' },
  { email: 'amaka@example.com', password: 'Password123!', label: 'Female 1' },
  { email: 'ngozi@example.com', password: 'Password123!', label: 'Female 2' },
];

function hashIdentifier(value) {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

async function main() {
  console.log('🌱 Seeding demo accounts...\n');

  for (const account of DEMO_ACCOUNTS) {
    const passwordHash = await bcrypt.hash(account.password, 10);
    const emailHash = hashIdentifier(account.email);

    const existing = await prisma.user.findFirst({
      where: { email: account.email },
    });

    if (existing) {
      console.log(`  ✅ ${account.label} (${account.email}) — already exists, skipping`);
      continue;
    }

    const user = await prisma.user.create({
      data: {
        email: account.email,
        emailHash,
        passwordHash,
        status: 'active',
        role: 'user',
        isVerified: true, // demo accounts are pre-verified
      },
    });

    console.log(`  ✅ ${account.label} (${account.email}) — created [id: ${user.id}]`);
  }

  console.log('\n✨ Seeding complete! You can now log in with any demo account.');
  console.log('   Password for all accounts: Password123!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
