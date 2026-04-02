const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTeamMembers() {
  try {
    console.log('🔍 Checking team members in database...');
    
    // Get all team members from database
    const teamMembers = await prisma.team.findMany({
      orderBy: { order: 'asc' }
    });
    
    console.log(`📊 Found ${teamMembers.length} team members in database:`);
    
    if (teamMembers.length === 0) {
      console.log('❌ No team members found in database');
      console.log('💡 You need to add team members through the admin dashboard first');
    } else {
      teamMembers.forEach((member, index) => {
        console.log(`${index + 1}. ${member.name} - ${member.position}`);
        console.log(`   Order: ${member.order}`);
        console.log(`   Image: ${member.image ? 'Yes' : 'No'}`);
        console.log('');
      });
    }
    
    // Test API endpoint
    console.log('🌐 Testing API endpoint...');
    try {
      const response = await fetch('http://localhost:3000/api/team');
      const data = await response.json();
      
      console.log('✅ API Response:');
      console.log(`   Success: ${data.success}`);
      console.log(`   Data length: ${data.data?.length || 0}`);
      console.log(`   Fallback: ${data.fallback || false}`);
      
      if (data.data && data.data.length > 0) {
        console.log('📋 Team members from API:');
        data.data.forEach((member, index) => {
          console.log(`${index + 1}. ${member.name} - ${member.position}`);
        });
      }
    } catch (apiError) {
      console.log('❌ API Error:', apiError.message);
    }
    
  } catch (error) {
    console.error('❌ Database Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTeamMembers();
