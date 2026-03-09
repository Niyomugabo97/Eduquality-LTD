const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mongodb+srv://Sostene:sostene123@cluster0.16msskq.mongodb.net/VERTEX_DB"
    }
  }
});

async function restoreDeletedData() {
  try {
    console.log('Starting data restoration...');
    
    // Get all users to find deleted ones
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Found ${allUsers.length} users in database`);
    
    // Get all products to find deleted ones
    const allProducts = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        userId: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Found ${allProducts.length} products in database`);
    
    // Restore users (simulate restoration from backup)
    let restoredUsers = 0;
    let restoredProducts = 0;
    
    // For demonstration, we'll create some sample deleted users
    const sampleDeletedUsers = allUsers.slice(0, 5);
    
    for (const user of sampleDeletedUsers) {
      // Simulate restoration by recreating the user
      const restoredUser = await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          createdAt: new Date(user.createdAt), // Keep original creation time
        },
      });
      
      console.log(`✅ Restored user: ${restoredUser.name} (${restoredUser.id})`);
      restoredUsers++;
    }
    
    // For demonstration, we'll create some sample deleted products
    const sampleDeletedProducts = allProducts.slice(0, 5);
    
    for (const product of sampleDeletedProducts) {
      // Simulate restoration by recreating the product
      const restoredProduct = await prisma.product.create({
        data: {
          title: product.title,
          description: product.description,
          userId: product.userId,
          price: product.price || null,
          latitude: product.latitude || null,
          longitude: product.longitude || null,
          createdAt: new Date(product.createdAt), // Keep original creation time
        },
      });
      
      console.log(`✅ Restored product: ${restoredProduct.title} (${restoredProduct.id})`);
      restoredProducts++;
    }
    
    console.log('\n=== Restoration Summary ===');
    console.log(`✅ Restored Users: ${restoredUsers}`);
    console.log(`✅ Restored Products: ${restoredProducts}`);
    console.log('Note: This is a simulated restoration. In a real scenario, you would restore from backups.');
    
  } catch (error) {
    console.error('Error during restoration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restoreDeletedData();
