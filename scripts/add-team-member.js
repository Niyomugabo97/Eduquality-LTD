const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addTeamMember() {
  try {
    console.log('👤 Adding new team member...');
    
    const newMember = await prisma.team.create({
      data: {
        name: "John Doe",
        position: "Customer Support Manager",
        image: "/images/team/john-doe.jpg",
        email: "john.doe@eduquality.rw",
        phone: "+250788676999",
        order: 7
      }
    });
    
    console.log('✅ Team member added successfully!');
    console.log(`   Name: ${newMember.name}`);
    console.log(`   Position: ${newMember.position}`);
    console.log(`   Email: ${newMember.email}`);
    console.log(`   Phone: ${newMember.phone}`);
    console.log('🎉 This member will now be visible on the home page!');
    
  } catch (error) {
    console.error('❌ Error adding team member:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTeamMember();
