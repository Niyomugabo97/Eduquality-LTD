async function testHomePage() {
  try {
    console.log('🏠 Testing home page team member visibility...');
    
    // Test the API endpoint directly
    const response = await fetch('http://localhost:3002/api/team');
    const data = await response.json();
    
    console.log('✅ API Response:');
    console.log(`   Success: ${data.success}`);
    console.log(`   Team Members Count: ${data.data?.length || 0}`);
    console.log(`   Using Fallback: ${data.fallback || false}`);
    
    if (data.data && data.data.length > 0) {
      console.log('📋 Team Members from Database:');
      data.data.forEach((member, index) => {
        console.log(`${index + 1}. ${member.name} - ${member.position}`);
        if (member.email) console.log(`   📧 Email: ${member.email}`);
        if (member.phone) console.log(`   📞 Phone: ${member.phone}`);
        if (member.image) console.log(`   🖼️  Image: ${member.image.substring(0, 50)}...`);
        console.log('');
      });
      
      console.log('🎉 Team members should be visible on home page!');
      console.log('📱 Each member will have email and phone contact buttons');
    } else {
      console.log('⚠️  No team members found in database');
      console.log('💡 Add team members through admin dashboard');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testHomePage();
