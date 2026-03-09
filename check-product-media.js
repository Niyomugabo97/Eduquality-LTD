const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkProductMedia() {
  try {
    console.log('Checking product media...');
    
    // Get all products
    const products = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
      },
      take: 5, // Check first 5 products
    });
    
    console.log(`Found ${products.length} products`);
    
    for (const product of products) {
      console.log(`\nChecking product: ${product.id} - ${product.title}`);
      
      try {
        // Check if media exists
        const mediaData = await prisma.productMedia.findFirst({
          where: { productId: product.id },
        });
        
        if (mediaData) {
          console.log('✅ Media found:', {
            images: mediaData.images?.length || 0,
            videos: mediaData.videos?.length || 0,
            mainImage: mediaData.mainImage ? 'yes' : 'no',
            mainVideo: mediaData.mainVideo ? 'yes' : 'no',
          });
        } else {
          console.log('❌ No media found for this product');
          
          // Create sample media for testing
          const sampleMedia = {
            productId: product.id,
            images: [
              'https://res.cloudinary.com/dzikttrya/image/upload/sample1.jpg',
              'https://res.cloudinary.com/dzikttrya/image/upload/sample2.jpg'
            ],
            videos: [
              'https://res.cloudinary.com/dzikttrya/video/upload/sample1.mp4'
            ],
            mainImage: 'https://res.cloudinary.com/dzikttrya/image/upload/sample1.jpg',
            mainVideo: 'https://res.cloudinary.com/dzikttrya/video/upload/sample1.mp4',
          };
          
          try {
            const result = await prisma.productMedia.create({
              data: sampleMedia,
            });
            console.log('✅ Created sample media:', result.id);
          } catch (createError) {
            console.log('❌ Failed to create sample media:', createError.message);
          }
        }
      } catch (error) {
        console.log('❌ Error checking media:', error.message);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProductMedia();
