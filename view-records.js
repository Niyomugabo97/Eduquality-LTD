const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mongodb+srv://Sostene:sostene123@cluster0.16msskq.mongodb.net/VERTEX_DB"
    }
  }
});

async function viewAllRecords() {
  try {
    console.log('=== DATABASE RECORDS VIEWER ===\n');
    
    // Get all Registration records
    console.log('📋 REGISTRATION RECORDS:');
    console.log('========================');
    
    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    if (registrations.length === 0) {
      console.log('❌ No registration records found');
    } else {
      console.log(`✅ Found ${registrations.length} registration records:\n`);
      
      registrations.forEach((reg, index) => {
        console.log(`📝 Registration #${index + 1}:`);
        console.log(`   ID: ${reg.id}`);
        console.log(`   Company: ${reg.companyName}`);
        console.log(`   Email: ${reg.email}`);
        console.log(`   TIN Number: ${reg.tinNumber}`);
        console.log(`   Phone: ${reg.phoneNumber}`);
        console.log(`   Location: ${reg.location}`);
        console.log(`   Services: ${reg.selectedServices ? reg.selectedServices.join(', ') : 'None'}`);
        console.log(`   Created: ${new Date(reg.createdAt).toLocaleString()}`);
        console.log(`   Updated: ${new Date(reg.updatedAt).toLocaleString()}`);
        console.log('---');
      });
    }
    
    console.log('\n📦 PRODUCT RECORDS:');
    console.log('====================');
    
    // Get all Product records with user information
    const products = await prisma.product.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        media: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    if (products.length === 0) {
      console.log('❌ No product records found');
    } else {
      console.log(`✅ Found ${products.length} product records:\n`);
      
      products.forEach((product, index) => {
        console.log(`🛍️ Product #${index + 1}:`);
        console.log(`   ID: ${product.id}`);
        console.log(`   Title: ${product.title}`);
        console.log(`   Description: ${product.description ? product.description.substring(0, 100) + '...' : 'No description'}`);
        console.log(`   Price: ${product.price ? '$' + product.price : 'Not specified'}`);
        console.log(`   Location: ${product.latitude && product.longitude ? `${product.latitude}, ${product.longitude}` : 'Not specified'}`);
        console.log(`   User ID: ${product.userId}`);
        console.log(`   User Name: ${product.user ? product.user.name : 'Unknown'}`);
        console.log(`   User Email: ${product.user ? product.user.email : 'Unknown'}`);
        console.log(`   Media Files: ${product.media ? product.media.length : 0} files`);
        
        if (product.media && product.media.length > 0) {
          console.log(`   Media URLs:`);
          product.media.forEach((media, mediaIndex) => {
            console.log(`     ${mediaIndex + 1}. ${media.images ? media.images.length : 0} images, ${media.videos ? media.videos.length : 0} videos`);
          });
        }
        
        console.log(`   Created: ${new Date(product.createdAt).toLocaleString()}`);
        console.log(`   Updated: ${new Date(product.updatedAt).toLocaleString()}`);
        console.log('---');
      });
    }
    
    console.log('\n📊 SUMMARY:');
    console.log('============');
    console.log(`Total Registrations: ${registrations.length}`);
    console.log(`Total Products: ${products.length}`);
    console.log(`Total Users with Products: ${products.filter(p => p.user).length}`);
    
  } catch (error) {
    console.error('Error fetching records:', error);
  } finally {
    await prisma.$disconnect();
  }
}

viewAllRecords();
