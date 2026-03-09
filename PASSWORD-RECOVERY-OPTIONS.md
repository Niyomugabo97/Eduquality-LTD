# 🔐 Password Recovery & Product Deletion Options

## Current Situation
- **Email**: claudeniyomugabo1555@gmail.com
- **Issue**: Forgot password
- **Need**: Delete a product
- **Problem**: Can't access account

## Solutions

### Option 1: Password Reset (Recommended)
If you have a password reset feature:

1. Go to: http://localhost:3000/login
2. Click: "Forgot Password" or "Reset Password"
3. Enter: claudeniyomugabo1555@gmail.com
4. Check your email for reset link
5. Create new password
6. Login and delete the product

### Option 2: Database Direct Access (Advanced)
If you have database access:

1. Connect to MongoDB Atlas
2. Go to VERTEX_DB database
3. Find user by email: claudeniyomugabo1555@gmail.com
4. Note the user ID
5. Find the product you want to delete
6. Delete the product manually

### Option 3: Create New Account (Quick Fix)
1. Go to: http://localhost:3000/registration
2. Register with the same email or a new one
3. Upload products again
4. Delete old products later when you remember password

### Option 4: Admin Access (If Available)
If there's an admin panel:

1. Go to: http://localhost:3000/admin
2. Login as administrator
3. Find user: claudeniyomugabo1555@gmail.com
4. Manage their products
5. Delete the specific product

## Technical Solutions

### Option 5: Manual Database Script
Create a script to delete product by email:

```javascript
// Delete product by user email
const { MongoClient } = require('mongodb');

async function deleteProductByEmail() {
  const client = new MongoClient("mongodb+srv://Sostene:sostene123@cluster0.16msskq.mongodb.net/VERTEX_DB?retryWrites=true&w=majority&appName=Cluster0");
  await client.connect();
  
  const db = client.db("VERTEX_DB");
  const users = db.collection("users");
  const products = db.collection("products");
  
  // Find user by email
  const user = await users.findOne({ email: "claudeniyomugabo1555@gmail.com" });
  
  if (user) {
    // Get user's products
    const userProducts = await products.find({ userId: user._id }).toArray();
    console.log("Products found:", userProducts.length);
    
    // Display products for selection
    userProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} (ID: ${product._id})`);
    });
    
    // You can then delete specific product by ID
    // await products.deleteOne({ _id: "PRODUCT_ID_HERE" });
  }
  
  await client.close();
}

deleteProductByEmail();
```

## Recommended Steps

### Immediate Action:
1. **Check for password reset** on login page
2. **Try common passwords** you might have used
3. **Check email** for password reset links
4. **Use admin access** if available

### If Nothing Works:
1. **Create new account** with same email
2. **Contact support** to merge accounts later
3. **Re-upload products** with new account
4. **Delete old account** when password is recovered

## Prevention Tips

### Future Password Management:
1. **Use password manager** to store credentials
2. **Write down passwords** in secure location
3. **Use memorable but strong** passwords
4. **Enable two-factor authentication** if available
5. **Set password recovery email** you access regularly

## Contact Information

### If You Need Help:
- **Development Team**: Can manually reset password in database
- **Database Admin**: Can delete products directly
- **Support Email**: vertexconsultancy84@gmail.com

## Security Note

### Important:
- Never share your password with others
- Use unique passwords for different accounts
- Update passwords regularly
- Keep recovery email accessible
