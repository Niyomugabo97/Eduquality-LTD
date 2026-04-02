const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testTeamFields() {
  try {
    console.log('🔍 Testing team member with email and phone fields...');
    
    // Test creating a team member with email and phone
    const testMember = await prisma.team.create({
      data: {
        name: "Test Member",
        position: "Test Position",
        email: "test@eduquality.rw",
        phone: "+250788676999",
        image: "/images/test.jpg",
        order: 999
      }
    });
    
    console.log('✅ Team member created with email and phone:');
    console.log(`   Name: ${testMember.name}`);
    console.log(`   Email: ${testMember.email}`);
    console.log(`   Phone: ${testMember.phone}`);
    
    // Clean up
    await prisma.team.delete({
      where: { id: testMember.id }
    });
    
    console.log('🧹 Test data cleaned up');
    console.log('🎉 Email and phone fields are working in the database!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    if (error.message.includes('email') || error.message.includes('phone')) {
      console.log('💡 The schema might need to be updated. Try running: npx prisma db push');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testTeamFields();
