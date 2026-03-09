// Delete product by ID
const { MongoClient } = require('mongodb');

async function deleteProductById() {
  try {
    // Get product ID from command line arguments
    const productId = process.argv[2];
    
    if (!productId) {
      console.log("❌ Please provide a product ID");
      console.log("📝 Usage: node delete-product-by-id.js [PRODUCT_ID]");
      console.log("🔍 First run: node find-and-delete-products.js to get product IDs");
      return;
    }
    
    console.log(`🗑️  Deleting product with ID: ${productId}`);
    
    // Connect to MongoDB
    const client = new MongoClient("mongodb+srv://Sostene:sostene123@cluster0.16msskq.mongodb.net/VERTEX_DB?retryWrites=true&w=majority&appName=Cluster0");
    await client.connect();
    
    const db = client.db("VERTEX_DB");
    const products = db.collection("products");
    const productMedia = db.collection("ProductMedia");
    
    // First, find the product to show what we're deleting
    const product = await products.findOne({ _id: productId });
    
    if (!product) {
      console.log("❌ Product not found with ID:", productId);
      await client.close();
      return;
    }
    
    console.log("✅ Product found:");
    console.log("   Title:", product.title);
    console.log("   Description:", product.description?.substring(0, 100) + "...");
    console.log("   Created:", product.createdAt);
    
    // Delete the product
    const deleteResult = await products.deleteOne({ _id: productId });
    
    if (deleteResult.deletedCount > 0) {
      console.log("✅ Product deleted successfully!");
      
      // Also delete associated media
      try {
        const mediaDeleteResult = await productMedia.deleteMany({ productId: productId });
        if (mediaDeleteResult.deletedCount > 0) {
          console.log(`✅ Also deleted ${mediaDeleteResult.deletedCount} media records`);
        }
      } catch (mediaError) {
        console.log("⚠️  Could not delete media records:", mediaError.message);
      }
      
    } else {
      console.log("❌ Failed to delete product");
    }
    
    await client.close();
    
  } catch (error) {
    console.error("❌ Error deleting product:", error);
  }
}

deleteProductById();
