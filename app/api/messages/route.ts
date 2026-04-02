import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Fetch messages for an order
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const senderType = searchParams.get('senderType');

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required." },
        { status: 400 }
      );
    }

    const where: any = { orderId };
    if (senderType) where.senderType = senderType.toUpperCase();

    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    // Mark unread messages as read
    if (messages.length > 0) {
      await prisma.message.updateMany({
        where: {
          orderId,
          isRead: false,
          senderType: 'STAFF' // Only mark staff messages as read
        },
        data: { isRead: true }
      });
    }

    return NextResponse.json({
      success: true,
      data: messages
    });
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch messages." },
      { status: 500 }
    );
  }
}

// POST - Send new message
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, senderId, senderType, content } = body;

    if (!orderId || !senderId || !senderType || !content) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Verify order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    const message = await prisma.message.create({
      data: {
        orderId,
        senderId,
        senderType: senderType.toUpperCase(),
        content
      }
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
      data: message
    });
  } catch (error: any) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send message." },
      { status: 500 }
    );
  }
}

// PUT - Mark messages as read
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { messageIds } = body;

    if (!messageIds || !Array.isArray(messageIds)) {
      return NextResponse.json(
        { success: false, message: "Message IDs are required." },
        { status: 400 }
      );
    }

    await prisma.message.updateMany({
      where: {
        id: { in: messageIds }
      },
      data: { isRead: true }
    });

    return NextResponse.json({
      success: true,
      message: "Messages marked as read."
    });
  } catch (error: any) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update messages." },
      { status: 500 }
    );
  }
}
