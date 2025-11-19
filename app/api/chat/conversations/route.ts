import { NextRequest, NextResponse } from 'next/server';
import mockData from '@/lib/data/mockData.json';

// GET /api/chat/conversations - Get all conversations for a user
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

    // Get unique conversations
    const userMessages = mockData.chatMessages.filter(m => 
      m.senderId === userId || m.receiverId === userId
    );

    const conversationMap = new Map();
    
    userMessages.forEach(msg => {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const otherUserName = msg.senderId === userId ? 
        mockData.users.find(u => u.id === msg.receiverId)?.name || msg.receiverId : 
        msg.senderName;
      const otherUserRole = msg.senderId === userId ? 
        mockData.users.find(u => u.id === msg.receiverId)?.role || 'tester' : 
        msg.senderRole;
      
      if (!conversationMap.has(msg.conversationId)) {
        conversationMap.set(msg.conversationId, {
          userId: otherUserId,
          userName: otherUserName,
          userRole: otherUserRole,
          lastMessage: msg.message,
          lastMessageDate: msg.createdDate,
          unreadCount: msg.receiverId === userId && !msg.read ? 1 : 0
        });
      } else {
        const conv = conversationMap.get(msg.conversationId);
        if (new Date(msg.createdDate) > new Date(conv.lastMessageDate)) {
          conv.lastMessage = msg.message;
          conv.lastMessageDate = msg.createdDate;
        }
        if (msg.receiverId === userId && !msg.read) {
          conv.unreadCount++;
        }
      }
    });

    const conversations = Array.from(conversationMap.values());

    return NextResponse.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}
