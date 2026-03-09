// Find and list products for claudeniyomugabo1555@gmail.com
const { MongoClient } = require('mongodb');

async function findProductsByEmail() {
  try {
    console.log("🔍 Looking for products for: claudeniyomugabo1555@gmail.com");
    
    // Connect to MongoDB
    const client = new MongoClient("mongodb+srv://Sostene:sostene123@cluster0.16msskq.mongodb.net/VERTEX_DB?retryWrites=true&w=majority&appName=Cluster0");
    await client.connect();
    
    const db = client.db("VERTEX_DB");
    const users = db.collection("users");
    const products = db.collection("products");
    
    // Find user by email
    const user = await users.findOne({ email: "claudeniyomugabo1555@gmail.com" });
    
    if (!user) {
      console.log("❌ User not found with email: claudeniyomugabo1555@gmail.com");
      await client.close();
      return;
    }
    
    console.log("✅ User found:");
    console.log("   Name:", user.name);
    console.log("   ID:", user._id);
    console.log("   Email:", user.email);
    
    // Get user's products
    const userProducts = await products.find({ userId: user._id }).toArray();
    
    console.log(`\n📦 Found ${userProducts.length} products:`);
    
    if (userProducts.length === 0) {
      console.log("   No products found for this user.");
    } else {
      userProducts.forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.title}`);
        console.log(`   ID: ${product._id}`);
        console.log(`   Description: ${product.description?.substring(0, 50)}...`);
        console.log(`   Price: ${product.price || 'Not set'}`);
        console.log(`   Available: ${product.available ? 'Yes' : 'No'}`);
        console.log(`   Created: ${product.createdAt}`);
        
        if (product.contactNumber) {
          console.log(`   Contact: ${product.contactNumber}`);
        }
        if (product.whatsappNumber) {
          console.log(`   WhatsApp: ${product.whatsappNumber}`);
        }
      });
      
      console.log("\n🗑️  To delete a product, run:");
      console.log("   node delete-product-by-id.js [PRODUCT_ID]");
      console.log("\n📝  Example:");
      console.log(`   node delete-product-by-id.js "${userProducts[0]?._id}"`);
    }
    
    await client.close();
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

findProductsByEmail();
