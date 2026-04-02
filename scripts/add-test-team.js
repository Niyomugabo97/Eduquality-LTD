const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addTestTeamMembers() {
  try {
    console.log('👥 Adding test team members for visibility...');
    
    // Clear existing team members
    await prisma.team.deleteMany({});
    console.log('🧹 Cleared existing team members');
    
    // Add multiple team members with contact info
    const teamMembers = [
      {
        name: "IRADUKUNDA Stiven",
        position: "Chief Executive Officer",
        image: "/images/team/stiven.jpg",
        email: "stiven@eduquality.rw",
        phone: "+250788676421",
        order: 1
      },
      {
        name: "GUSENGA Benjamin",
        position: "Project Manager",
        image: "/images/team/benjamin.jpg",
        email: "benjamin@eduquality.rw",
        phone: "+250788676422",
        order: 2
      },
      {
        name: "AKIMANIMPAYE Rachel",
        position: "Secretary",
        image: "/images/team/rachel.jpg",
        email: "rachel@eduquality.rw",
        phone: "+250788676423",
        order: 3
      }
    ];
    
    for (const member of teamMembers) {
      await prisma.team.create({ data: member });
      console.log(`✅ Added: ${member.name} - ${member.position}`);
    }
    
    console.log(`🎉 Successfully added ${teamMembers.length} team members!`);
    console.log('📱 They will be visible on home page with contact buttons');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestTeamMembers();
