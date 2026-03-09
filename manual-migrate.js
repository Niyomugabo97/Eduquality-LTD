const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function manualMigration() {
  try {
    console.log('Starting manual migration...');
    
    // Try to create ProductMedia entry using the existing API approach
    // First, get a test product
    const testProduct = await prisma.product.findFirst();
    
    if (testProduct) {
      console.log('Found test product:', testProduct.id);
      
      // Try to create ProductMedia entry using the upload API approach
      const mediaData = {
        productId: testProduct.id,
        images: ['https://res.cloudinary.com/dzikttrya/image/upload/test1.jpg'],
        videos: ['https://res.cloudinary.com/dzikttrya/video/upload/test1.mp4'],
        mainImage: 'https://res.cloudinary.com/dzikttrya/image/upload/test1.jpg',
        mainVideo: 'https://res.cloudinary.com/dzikttrya/video/upload/test1.mp4',
      };
      
      try {
        // Use raw MongoDB operation through Prisma
        const result = await prisma.$runCommandRaw({
          insert: 'ProductMedia',
          documents: [mediaData]
        });
        console.log('ProductMedia collection created and test document inserted:', result);
        
        // Clean up test document
        await prisma.$runCommandRaw({
          delete: 'ProductMedia',
          deletes: [{
            q: { productId: testProduct.id },
            limit: 1
          }]
        });
        console.log('Test document cleaned up');
        
      } catch (error) {
        console.log('Raw command failed, trying direct Prisma access...');
        
        // Try the type casting approach
        try {
          const result = await prisma.productMedia.create({
            data: mediaData
          });
          console.log('ProductMedia created via type casting:', result.id);
          
          // Clean up
          await prisma.productMedia.delete({
            where: { id: result.id }
          });
          console.log('Test document cleaned up');
          
        } catch (typeError) {
          console.log('Type casting failed, ProductMedia collection may not exist');
          console.log('Error details:', typeError.message);
        }
      }
    } else {
      console.log('No test product found');
    }
    
    console.log('Manual migration completed!');
    
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

manualMigration();
