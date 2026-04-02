const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testMongoDBConnection() {
  try {
    console.log('🔍 Testing MongoDB connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test database operations
    const adminCount = await prisma.admin.count();
    console.log(`📊 Current admin count: ${adminCount}`);
    
    const userCount = await prisma.user.count();
    console.log(`👥 Current user count: ${userCount}`);
    
    // Create admin if not exists
    if (adminCount === 0) {
      console.log('👤 Creating default admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const admin = await prisma.admin.create({
        data: {
          name: 'Admin User',
          email: 'vertexconsultancy84@gmail.com',
          password: hashedPassword,
          role: 'admin'
        }
      });
      
      console.log('✅ Default admin created successfully!');
      console.log(`   Email: ${admin.email}`);
      console.log(`   Password: admin123`);
    }
    
    console.log('🎉 MongoDB setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing MongoDB:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testMongoDBConnection();
