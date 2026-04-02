import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Fetch feedback for an order or all feedback
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const customerId = searchParams.get('customerId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (orderId) where.orderId = orderId;
    if (customerId) where.customerId = customerId;

    const feedback = await prisma.feedback.findMany({
      where,
      include: {
        order: {
          select: {
            orderNumber: true,
            serviceType: true,
            customerName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const total = await prisma.feedback.count({ where });

    return NextResponse.json({
      success: true,
      data: feedback,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch feedback." },
      { status: 500 }
    );
  }
}

// POST - Submit feedback for an order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderId,
      customerId,
      rating,
      comment,
      serviceQuality,
      deliverySpeed,
      staffProfessionalism,
      wouldRecommend
    } = body;

    if (!orderId || !customerId || !rating) {
      return NextResponse.json(
        { success: false, message: "Order ID, customer ID, and rating are required." },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "Rating must be between 1 and 5." },
        { status: 400 }
      );
    }

    // Check if order exists and is delivered
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    if (order.status !== 'DELIVERED') {
      return NextResponse.json(
        { success: false, message: "Feedback can only be submitted for delivered orders." },
        { status: 400 }
      );
    }

    // Check if feedback already exists
    const existingFeedback = await prisma.feedback.findUnique({
      where: { orderId }
    });

    if (existingFeedback) {
      return NextResponse.json(
        { success: false, message: "Feedback already submitted for this order." },
        { status: 400 }
      );
    }

    const feedback = await prisma.feedback.create({
      data: {
        orderId,
        customerId,
        rating,
        comment,
        serviceQuality,
        deliverySpeed,
        staffProfessionalism,
        wouldRecommend
      }
    });

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully!",
      data: feedback
    });
  } catch (error: any) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit feedback." },
      { status: 500 }
    );
  }
}
