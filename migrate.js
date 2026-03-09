const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function migrate() {
  try {
    console.log('Starting migration...');
    
    // Test if ProductMedia collection exists
    try {
      await prisma.productMedia.findFirst();
      console.log('ProductMedia collection already exists');
    } catch (error) {
      console.log('ProductMedia collection does not exist, creating...');
    }
    
    // Try to create a test product with media
    const testUser = await prisma.user.findFirst();
    if (testUser) {
      const testProduct = await prisma.product.create({
        data: {
          title: 'Test Product',
          description: 'Test Description',
          userId: testUser.id,
        },
      });
      
      console.log('Created test product:', testProduct.id);
      
      // Try to create media entry
      try {
        await prisma.productMedia.create({
          data: {
            productId: testProduct.id,
            images: ['https://test.com/image1.jpg', 'https://test.com/image2.jpg'],
            videos: ['https://test.com/video1.mp4'],
            mainImage: 'https://test.com/image1.jpg',
            mainVideo: 'https://test.com/video1.mp4',
          },
        });
        console.log('Created test media entry');
      } catch (mediaError) {
        console.error('Failed to create media entry:', mediaError);
      }
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
