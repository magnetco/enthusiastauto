import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create test user with hashed password
  const hashedPassword = await bcrypt.hash("Test1234", 12);

  const testUser = await prisma.user.upsert({
    where: { email: "test@enthusiastauto.com" },
    update: {},
    create: {
      email: "test@enthusiastauto.com",
      name: "Test User",
      password: hashedPassword,
      emailVerified: new Date(), // Pre-verified for testing
    },
  });

  console.log("✅ Created test user:", {
    id: testUser.id,
    email: testUser.email,
    name: testUser.name,
  });

  console.log("\n📝 Test credentials:");
  console.log("   Email: test@enthusiastauto.com");
  console.log("   Password: Test1234");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
