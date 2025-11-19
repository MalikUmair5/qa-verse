import { NextRequest, NextResponse } from 'next/server';
import mockData from '@/lib/data/mockData.json';

// GET /api/bugs/[id]/comments - Get comments for a bug report
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bug = mockData.bugReports.find(b => b.id === id);

    if (!bug) {
      return NextResponse.json(
        { error: 'Bug report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: bug.comments || []
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/bugs/[id]/comments - Add comment to bug report
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, userName, userRole, comment } = body;

    const bug = mockData.bugReports.find(b => b.id === id);

    if (!bug) {
      return NextResponse.json(
        { error: 'Bug report not found' },
        { status: 404 }
      );
    }

    const newComment = {
      id: `c${Date.now()}`,
      userId,
      userName,
      userRole,
      comment,
      createdDate: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newComment
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    );
  }
}
