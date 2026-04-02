const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAllUsers() {
  try {
    console.log("=== CHECKING ALL USERS ===");
    
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true }
    });
    
    console.log(`Total users found: ${users.length}`);
    
    users.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Name: ${user.name}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Created: ${user.createdAt}`);
    });
    
    // Check specifically for your email
    const targetEmail = "claudeniyomugabo1555@gmail.com";
    const yourUser = users.find(u => u.email === targetEmail);
    
    if (yourUser) {
      console.log(`\n✅ FOUND YOUR USER: ${yourUser.name} (${yourUser.email})`);
    } else {
      console.log(`\n❌ YOUR EMAIL NOT FOUND: ${targetEmail}`);
    }
    
  } catch (error) {
    console.error("❌ ERROR:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllUsers();
