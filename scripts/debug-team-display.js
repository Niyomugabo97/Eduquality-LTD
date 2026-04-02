async function debugTeamDisplay() {
  try {
    console.log('🔍 Debugging team member display...');
    
    // Test API and component logic
    const response = await fetch('http://localhost:3002/api/team');
    const data = await response.json();
    
    console.log('📊 API Analysis:');
    console.log(`   Success: ${data.success}`);
    console.log(`   Data exists: ${!!data.data}`);
    console.log(`   Data length: ${data.data?.length || 0}`);
    console.log(`   Data > 0: ${data.data?.length > 0}`);
    
    // Simulate component logic
    const shouldUseDatabaseData = data.success && data.data && data.data.length > 0;
    console.log(`   Component will use database data: ${shouldUseDatabaseData}`);
    
    if (shouldUseDatabaseData) {
      console.log('✅ Team members SHOULD be visible on home page');
      console.log('👥 Team members to display:');
      data.data.forEach((member, i) => {
        console.log(`   ${i+1}. ${member.name} (${member.position})`);
        console.log(`      📧 ${member.email || 'No email'}`);
        console.log(`      📞 ${member.phone || 'No phone'}`);
      });
    } else {
      console.log('⚠️  Component will use fallback data');
      console.log('💡 This means database team members won\'t show');
    }
    
    console.log('\n🎯 Troubleshooting:');
    console.log('1. Check if development server is running');
    console.log('2. Check browser console for errors');
    console.log('3. Check if AboutUsSection component is imported');
    console.log('4. Verify teamworkers state is being set');
    
  } catch (error) {
    console.error('❌ Debug error:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Start the development server first: npm run dev');
    }
  }
}

debugTeamDisplay();
