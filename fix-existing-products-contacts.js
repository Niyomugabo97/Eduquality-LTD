// Fix existing products by adding contact fields directly to MongoDB
const { MongoClient } = require('mongodb');

async function fixExistingProducts() {
  try {
    console.log("🔧 Fixing existing products with contact fields...");
    
    // Connect to MongoDB
    const client = new MongoClient(process.env.DATABASE_URL);
    await client.connect();
    
    const db = client.db("VERTEX_DB");
    const products = db.collection("products");
    
    // Get all existing products
    const existingProducts = await products.find({}).toArray();
    console.log(`📊 Found ${existingProducts.length} products to update`);
    
    // Update each product to include contact fields
    let updatedCount = 0;
    for (const product of existingProducts) {
      const result = await products.updateOne(
        { _id: product._id },
        { 
          $set: {
            contactNumber: product.contactNumber || null,
            whatsappNumber: product.whatsappNumber || null
          }
        }
      );
      
      if (result.modifiedCount > 0) {
        updatedCount++;
        console.log(`✅ Updated product: ${product.title}`);
      } else {
        console.log(`⚠️ No changes needed for: ${product.title}`);
      }
    }
    
    console.log(`🎉 Successfully updated ${updatedCount} products with contact fields!`);
    
    await client.close();
    
  } catch (error) {
    console.error("❌ Error fixing products:", error);
  }
}

fixExistingProducts();
