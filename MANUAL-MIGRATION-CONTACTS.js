// Manual migration script to add contact fields to existing products
const { MongoClient } = require('mongodb');

async function addContactFieldsToExistingProducts() {
  try {
    console.log("🔧 Starting manual migration for contact fields...");
    
    // Connect to MongoDB
    const client = new MongoClient("mongodb+srv://Sostene:sostene123@cluster0.16msskq.mongodb.net/VERTEX_DB?retryWrites=true&w=majority&appName=Cluster0");
    await client.connect();
    
    const db = client.db("VERTEX_DB");
    const products = db.collection("products");
    
    // Get all existing products
    const existingProducts = await products.find({}).toArray();
    console.log(`📊 Found ${existingProducts.length} products to update`);
    
    // Update each product to include contact fields (if they don't already exist)
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const product of existingProducts) {
      const updateData = {};
      
      // Only add contact fields if they don't already exist
      if (!('contactNumber' in product)) {
        updateData.contactNumber = product.contactNumber || null;
      }
      
      if (!('whatsappNumber' in product)) {
        updateData.whatsappNumber = product.whatsappNumber || null;
      }
      
      // Only update if there are changes to make
      if (Object.keys(updateData).length > 0) {
        const result = await products.updateOne(
          { _id: product._id },
          { $set: updateData }
        );
        
        if (result.modifiedCount > 0) {
          updatedCount++;
          console.log(`✅ Updated product: ${product.title || 'Untitled'} (ID: ${product._id})`);
        }
      } else {
        skippedCount++;
        console.log(`⚠️ Skipped product: ${product.title || 'Untitled'} (already has contact fields)`);
      }
    }
    
    console.log(`🎉 Migration completed!`);
    console.log(`✅ Updated ${updatedCount} products with contact fields`);
    console.log(`⚠️ Skipped ${skippedCount} products (already had contact fields)`);
    console.log(`📊 Total products processed: ${existingProducts.length}`);
    
    await client.close();
    
  } catch (error) {
    console.error("❌ Migration error:", error);
  }
}

// Run the migration
addContactFieldsToExistingProducts();
