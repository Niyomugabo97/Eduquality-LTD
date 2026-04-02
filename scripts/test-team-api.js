async function testTeamAPI() {
  try {
    console.log('🔍 Testing team API...');
    
    const response = await fetch('http://localhost:3000/api/team');
    const data = await response.json();
    
    console.log('✅ API Response:');
    console.log(`   Success: ${data.success}`);
    console.log(`   Team Members: ${data.data?.length || 0}`);
    console.log(`   Using Fallback: ${data.fallback || false}`);
    
    if (data.data && data.data.length > 0) {
      console.log('📋 Team Members:');
      data.data.forEach((member, index) => {
        console.log(`${index + 1}. ${member.name} - ${member.position}`);
        if (member.email) console.log(`   📧 Email: ${member.email}`);
        if (member.phone) console.log(`   📞 Phone: ${member.phone}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ API Error:', error.message);
  }
}

testTeamAPI();
