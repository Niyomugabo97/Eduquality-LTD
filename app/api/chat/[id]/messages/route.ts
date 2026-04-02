import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { cookies } from 'next/headers';

// GET /api/chat/[id]/messages - Get messages for a specific chat
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: chatId } = await params;
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

    if (!currentUserId) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 401 }
      );
    }

    // Verify user is part of this chat
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        OR: [
          { customerId: currentUserId },
          { sellerId: currentUserId }
        ]
      }
    });

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found or access denied' },
        { status: 404 }
      );
    }

    // Get messages
    const messages = await prisma.chatMessage.findMany({
      where: { chatId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Mark messages as read (where sender is not current user)
    await prisma.chatMessage.updateMany({
      where: {
        chatId,
        senderId: { not: currentUserId },
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/chat/[id]/messages - Send a new message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: chatId } = await params;
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

    if (!currentUserId) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content } = body;

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    // Verify user is part of this chat
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        OR: [
          { customerId: currentUserId },
          { sellerId: currentUserId }
        ]
      }
    });

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found or access denied' },
        { status: 404 }
      );
    }

    // Create message
    const message = await prisma.chatMessage.create({
      data: {
        chatId,
        senderId: currentUserId,
        content: content.trim(),
        isRead: false
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    // Update chat's updatedAt timestamp
    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
