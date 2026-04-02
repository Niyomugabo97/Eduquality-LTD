import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Fetch all orders (for admin) or user orders (for customers)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (customerId) where.customerId = customerId;
    if (status) where.status = status;

    // Get orders with related messages and feedback
    const orders = await prisma.order.findMany({
      where,
      include: {
        messages: {
          orderBy: { createdAt: 'desc' }
        },
        feedback: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    // Get total count for pagination
    const total = await prisma.order.count({ where });

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders." },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      serviceType,
      description,
      quantity,
      price,
      deliveryAddress,
      notes,
      priority = 'NORMAL'
    } = body;

    // Validate required fields
    if (!customerId || !customerName || !customerEmail || !serviceType || !description) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId,
        customerName,
        customerEmail,
        customerPhone,
        serviceType,
        description,
        quantity,
        price,
        deliveryAddress,
        notes,
        priority: priority.toUpperCase(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }
    });

    return NextResponse.json({
      success: true,
      message: "Order placed successfully!",
      data: order
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to place order." },
      { status: 500 }
    );
  }
}

// PUT - Update order status
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status, assignedTo, estimatedDelivery, notes } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, message: "Order ID and status are required." },
        { status: 400 }
      );
    }

    const updateData: any = { status };
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (estimatedDelivery) updateData.estimatedDelivery = new Date(estimatedDelivery);
    if (notes) updateData.notes = notes;

    // Set actual delivery date when order is delivered
    if (status === 'DELIVERED') {
      updateData.actualDelivery = new Date();
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      message: "Order updated successfully!",
      data: order
    });
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order." },
      { status: 500 }
    );
  }
}

// DELETE - Cancel/delete order
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required." },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    // Only allow cancellation of pending or confirmed orders
    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      return NextResponse.json(
        { success: false, message: "Order cannot be cancelled at this stage." },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' }
    });

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully!",
      data: updatedOrder
    });
  } catch (error: any) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to cancel order." },
      { status: 500 }
    );
  }
}
