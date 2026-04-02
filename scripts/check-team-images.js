const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTeamImages() {
  try {
    console.log('🔍 Checking team member images...');
    
    const teamMembers = await prisma.team.findMany({
      orderBy: { order: 'asc' }
    });
    
    console.log(`📊 Found ${teamMembers.length} team members:`);
    
    teamMembers.forEach((member, index) => {
      console.log(`\n${index + 1}. ${member.name}`);
      console.log(`   Position: ${member.position}`);
      console.log(`   Image: ${member.image.substring(0, 50)}...`);
      console.log(`   Image Type: ${member.image.startsWith('data:') ? 'Base64' : 'URL'}`);
      console.log(`   Email: ${member.email || 'No email'}`);
      console.log(`   Phone: ${member.phone || 'No phone'}`);
    });
    
    console.log('\n🎯 Image Analysis:');
    teamMembers.forEach(member => {
      if (member.image.startsWith('data:')) {
        console.log(`✅ ${member.name}: Base64 image (should work)`);
      } else if (member.image.startsWith('/images/')) {
        console.log(`📁 ${member.name}: Local image file`);
        // Check if file exists
        const fs = require('fs');
        const path = require('path');
        const fullPath = path.join(__dirname, '..', 'public', member.image);
        if (fs.existsSync(fullPath)) {
          console.log(`   ✅ File exists: ${fullPath}`);
        } else {
          console.log(`   ❌ File missing: ${fullPath}`);
        }
      } else {
        console.log(`⚠️  ${member.name}: Unknown image format`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTeamImages();
