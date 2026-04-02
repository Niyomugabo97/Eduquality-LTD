import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { cookies } from 'next/headers';

// GET /api/chat - Get user's chats (both as customer and seller)
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_session")?.value;
    const adminId = cookieStore.get("session_token")?.value;

    if (!userId && !adminId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const currentUserId = userId || adminId;

    // Get chats where user is either customer or seller
    const chats = await prisma.chat.findMany({
      where: {
        OR: [
          { customerId: currentUserId },
          { sellerId: currentUserId }
        ]
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            mainImage: true,
            price: true,
          }
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Get last message for preview
          select: {
            id: true,
            content: true,
            createdAt: true,
            senderId: true,
            isRead: true,
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Count unread messages for each chat
    const chatsWithUnreadCount = await Promise.all(
      chats.map(async (chat) => {
        const unreadCount = await prisma.chatMessage.count({
          where: {
            chatId: chat.id,
            senderId: { not: currentUserId },
            isRead: false
          }
        });
        return { ...chat, unreadCount };
      })
    );

    return NextResponse.json({
      success: true,
      data: chatsWithUnreadCount
    });
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chats' },
      { status: 500 }
    );
  }
}

// POST /api/chat - Create a new chat or get existing
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_session")?.value;
    const adminId = cookieStore.get("session_token")?.value;

    if (!userId && !adminId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const currentUserId = userId || adminId;
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get product to find seller
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { userId: true }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Don't allow chat with yourself
    if (product.userId === currentUserId) {
      return NextResponse.json(
        { error: 'Cannot chat about your own product' },
        { status: 400 }
      );
    }

    // Check if chat already exists
    let chat = await prisma.chat.findFirst({
      where: {
        productId,
        customerId: currentUserId,
        sellerId: product.userId
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            mainImage: true,
            price: true,
          }
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
      }
    });

    // Create new chat if doesn't exist
    if (!chat) {
      const newChat = await prisma.chat.create({
        data: {
          productId,
          customerId: currentUserId!,
          sellerId: product.userId,
          isActive: true
        }
      });

      // Fetch the created chat with relations
      chat = await prisma.chat.findUnique({
        where: { id: newChat.id },
        include: {
          product: {
            select: {
              id: true,
              title: true,
              mainImage: true,
              price: true,
            }
          },
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: chat
    });
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json(
      { error: 'Failed to create chat' },
      { status: 500 }
    );
  }
}
