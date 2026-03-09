const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mongodb+srv://Sostene:sostene123@cluster0.16msskq.mongodb.net/VERTEX_DB"
    }
  }
});

async function addAvailabilityField() {
  try {
    console.log('Adding availability field to existing products...');
    
    // Get all existing products
    const existingProducts = await prisma.product.findMany();
    console.log(`Found ${existingProducts.length} existing products`);
    
    // Update all existing products to have available: true by default
    for (const product of existingProducts) {
      await prisma.product.update({
        where: { id: product.id },
        data: { available: true }
      });
      console.log(`✅ Updated product: ${product.title} - Available: true`);
    }
    
    console.log('\n=== Migration Complete ===');
    console.log(`✅ Updated ${existingProducts.length} products with availability field`);
    
  } catch (error) {
    console.error('Error adding availability field:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addAvailabilityField();
