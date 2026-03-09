const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addTeamMembers() {
  try {
    // Check if team members already exist
    const existingMembers = await prisma.team.count();
    
    if (existingMembers > 0) {
      console.log(`✅ Team members already exist (${existingMembers} found)`);
      return;
    }

    // Add team members
    const teamMembers = [
      {
        name: "IRADUKUNDA Stiven",
        position: "Chief Executive Officer",
        image: "/images/team/stiven.jpg",
        order: 1
      },
      {
        name: "GUSENGA Benjamin",
        position: "Project Manager",
        image: "/images/team/benjamin.jpg",
        order: 2
      },
      {
        name: "AKIMANIMPAYE Rachel",
        position: "Secretary",
        image: "/images/team/rachel.jpg",
        order: 3
      },
      {
        name: "MASENGESHO Bertin",
        position: "Accountant",
        image: "/images/team/bertin.jpg",
        order: 4
      },
      {
        name: "NIRAGIRE Magnifique",
        position: "IT Specialist",
        image: "/images/team/magnifique.jpg",
        order: 5
      },
      {
        name: "Sostene BANANAYO",
        position: "Developer",
        image: "/images/team/sostene.jpg",
        order: 6
      }
    ];

    console.log('Adding team members...');
    
    for (const member of teamMembers) {
      await prisma.team.create({
        data: member
      });
      console.log(`✅ Added: ${member.name} - ${member.position}`);
    }

    console.log(`🎉 Successfully added ${teamMembers.length} team members!`);
    
  } catch (error) {
    console.error('❌ Error adding team members:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTeamMembers();
