import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding demo admin user...');

  const email = 'demo@dinanwuye.com';
  const name = 'Demo Admin';
  const password = 'demo123456';
  const role = 'super_admin';

  // Check if admin already exists
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log('✅ Demo admin user already exists:', email);
    return;
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create demo admin user
  const admin = await prisma.adminUser.create({
    data: {
      email,
      name,
      passwordHash,
      role,
      permissions: ['*'], // All permissions for super_admin
      isActive: true,
    },
  });

  console.log('✅ Demo admin user created successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 Email:', admin.email);
  console.log('👤 Name:', admin.name);
  console.log('🔑 Role:', admin.role);
  console.log('🔒 Password:', password);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('💡 You can now log in to the admin dashboard at:');
  console.log('   http://localhost:5173 (or your frontend URL)');
  console.log('   Email: demo@dinanwuye.com');
  console.log('   Password: demo123456');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });