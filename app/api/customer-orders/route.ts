import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch all orders with serviceType 'PRODUCT_ORDER' 
    // These are customer orders for products
    const orders = await prisma.order.findMany({
      where: {
        serviceType: 'PRODUCT_ORDER'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data to match the expected format
    const transformedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status.toLowerCase(),
      createdAt: order.createdAt,
      total: order.price || 0,
      customer: {
        fullName: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
        deliveryAddress: order.deliveryAddress,
        city: '', // Not available in current schema
        province: '', // Not available in current schema
        paymentMethod: 'CASH', // Default
        notes: order.notes
      },
      items: [{
        id: order.id,
        title: order.description,
        price: order.price || 0,
        quantity: order.quantity || 1,
        subtotal: (order.price || 0) * (order.quantity || 1)
      }]
    }));

    return NextResponse.json(transformedOrders);
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer orders' },
      { status: 500 }
    );
  }
}
