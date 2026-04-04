"use server";

import prisma from "@/lib/prisma";

export async function getAllOrders() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 50, // Limit to 50 most recent orders
    });

    return {
      success: true,
      data: orders.map(order => ({
        ...order,
        // Ensure all required fields for OrderSummary component
        customerAddress: order.deliveryAddress || 'N/A',
        customerCity: 'N/A', // This would need to be parsed from deliveryAddress
        customerProvince: 'N/A', // This would need to be parsed from deliveryAddress
        customerIdNumber: 'N/A', // This field doesn't exist in Order model
      }))
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      success: false,
      error: "Failed to fetch orders"
    };
  }
}
