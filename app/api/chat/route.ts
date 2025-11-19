import { NextRequest, NextResponse } from 'next/server';
import mockData from '@/lib/data/mockData.json';

// GET /api/chat - Get chat messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const conversationId = searchParams.get('conversationId');

    let messages = [...mockData.chatMessages];

    if (conversationId) {
      messages = messages.filter(m => m.conversationId === conversationId);
    } else if (userId) {
      // Get all conversations for user
      messages = messages.filter(m => 
        m.senderId === userId || m.receiverId === userId
      );
    }

    return NextResponse.json({
      success: true,
      data: messages
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/chat - Send new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderId, senderName, senderRole, receiverId, message, conversationId } = body;

    const newMessage = {
      id: String(Date.now()),
      conversationId: conversationId || `conv-${senderId}-${receiverId}`,
      senderId,
      senderName,
      senderRole,
      receiverId,
      message,
      createdDate: new Date().toISOString(),
      read: false
    };

    return NextResponse.json({
      success: true,
      data: newMessage
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
