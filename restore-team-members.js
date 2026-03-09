const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mongodb+srv://Sostene:sostene123@cluster0.16msskq.mongodb.net/VERTEX_DB"
    }
  }
});

async function restoreTeamMembers() {
  try {
    console.log('Restoring original team members...');
    
    // Original team members from the hardcoded data
    const originalTeamMembers = [
      {
        name: "IRADUKUNDA Stiven",
        position: "Chief Executive Officer",
        image: "/images/worker1.jpg?height=400&width=300",
        order: 0,
      },
      {
        name: "GUSENGA Benjamin",
        position: "Project Manager",
        image: "/images/worker2.jpg?height=400&width=300",
        order: 1,
      },
      {
        name: "AKIMANIMPAYE Rachel",
        position: "Secretary",
        image: "/images/worker3.jpg?height=400&width=300",
        order: 2,
      },
      {
        name: "MASENGESHO Bertin",
        position: "Accountant",
        image: "/images/worker4.jpg?height=400&width=300",
        order: 3,
      },
      {
        name: "NIRAGIRE Magnifique",
        position: "IT Specialist",
        image: "/images/worker5.jpg?height=400&width=300",
        order: 4,
      },
      {
        name: "Sostene BANANAYO",
        position: "Developer",
        image: "/images/profile.jpg?height=400&width=300",
        order: 5,
      },
    ];

    // Clear existing team members
    console.log('Clearing existing team members...');
    await prisma.team.deleteMany({});
    console.log('✅ Existing team members cleared');

    // Add original team members
    console.log('Adding original team members...');
    for (const member of originalTeamMembers) {
      const createdMember = await prisma.team.create({
        data: member,
      });
      console.log(`✅ Restored: ${createdMember.name} - ${createdMember.position}`);
    }

    // Verify restoration
    const allMembers = await prisma.team.findMany({
      orderBy: { order: 'asc' }
    });

    console.log('\n=== Restoration Complete ===');
    console.log(`✅ Total team members restored: ${allMembers.length}`);
    console.log('\nRestored team members:');
    allMembers.forEach((member, index) => {
      console.log(`${index + 1}. ${member.name} - ${member.position} (Order: ${member.order})`);
    });

  } catch (error) {
    console.error('Error restoring team members:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restoreTeamMembers();
