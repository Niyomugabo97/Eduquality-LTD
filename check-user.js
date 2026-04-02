import prisma from "@/lib/prisma";

// Check if user exists and debug login issue
async function checkUser() {
  try {
    const email = "claudeniyomugabo1555@gmail.com";
    
    console.log("=== CHECKING USER ===");
    console.log("Email:", email);
    
    // Check if user exists
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: { id: true, name: true, email: true, password: true, createdAt: true }
    });
    
    if (!user) {
      console.log("❌ USER NOT FOUND in database");
      return;
    }
    
    console.log("✅ USER FOUND:");
    console.log("  ID:", user.id);
    console.log("  Name:", user.name);
    console.log("  Email:", user.email);
    console.log("  Password hash:", user.password ? "EXISTS" : "MISSING");
    console.log("  Created:", user.createdAt);
    
  } catch (error) {
    console.error("❌ ERROR:", error);
  }
}

checkUser();
