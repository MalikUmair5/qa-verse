import { NextRequest, NextResponse } from 'next/server';
import mockData from '@/lib/data/mockData.json';

// GET /api/notifications - Get user notifications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    let notifications = mockData.notifications;

    if (userId) {
      notifications = notifications.filter(n => n.userId === userId);
    }

    if (unreadOnly) {
      notifications = notifications.filter(n => !n.read);
    }

    return NextResponse.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// POST /api/notifications/mark-read - Mark notification as read
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId } = body;

    const notification = mockData.notifications.find(n => n.id === notificationId);

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to mark notification as read' },
      { status: 500 }
    );
  }
}
