import { NextRequest, NextResponse } from 'next/server';
import mockData from '@/lib/data/mockData.json';

// POST /api/bugs/[id]/reject - Reject bug report
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { reason } = body;

    const bug = mockData.bugReports.find(b => b.id === id);

    if (!bug) {
      return NextResponse.json(
        { error: 'Bug report not found' },
        { status: 404 }
      );
    }

    const updatedBug = {
      ...bug,
      status: 'Rejected',
      rejectionReason: reason,
      updatedDate: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: updatedBug,
      message: 'Bug report rejected'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to reject bug report' },
      { status: 500 }
    );
  }
}
