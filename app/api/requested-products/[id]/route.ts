import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const { status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    // Validate status and map to OrderStatus enum
    const statusMap: Record<string, string> = {
      'pending': 'PENDING',
      'approved': 'CONFIRMED',
      'in_process': 'IN_PROGRESS',
      'delivered': 'DELIVERED',
      'cancelled': 'CANCELLED',
      'rejected': 'CANCELLED'
    };

    const upperStatus = statusMap[status.toLowerCase()];
    if (!upperStatus) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update the order status in database
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status: upperStatus as any,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Delete the order
    await prisma.order.delete({
      where: { id: orderId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
