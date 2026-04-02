import prisma from "@/lib/prisma";

// This is a temporary debug script to check user credentials
export async function debugUserLogin() {
  try {
    const email = "claudeniyomugabo1555@gmail.com";
    const password = "claude@123";
    
    console.log("=== DEBUG USER LOGIN ===");
    console.log("Email:", email);
    console.log("Password:", password);
    
    // Check if user exists
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: { id: true, name: true, email: true, password: true }
    });
    
    if (!user) {
      console.log("❌ User not found in database");
      return { success: false, message: "User not found" };
    }
    
    console.log("✅ User found:", { id: user.id, name: user.name, email: user.email });
    console.log("🔐 Password hash exists:", !!user.password);
    
    // Test password comparison
    const bcrypt = require('bcryptjs');
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    console.log("🔑 Password match:", passwordMatch);
    
    if (passwordMatch) {
      return { success: true, message: "Login should work", user: { id: user.id, name: user.name, email: user.email } };
    } else {
      return { success: false, message: "Password does not match" };
    }
    
  } catch (error) {
    console.error("❌ Debug error:", error);
    return { success: false, message: "Debug error occurred" };
  }
}

// Uncomment to run this function
// debugUserLogin().then(console.log);
