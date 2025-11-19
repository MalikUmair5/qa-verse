import { NextRequest, NextResponse } from 'next/server';
import mockData from '@/lib/data/mockData.json';

// POST /api/bugs/[id]/resolve - Mark bug as resolved
export async function POST(
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

    const updatedBug = {
      ...bug,
      status: 'Resolved',
      updatedDate: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: updatedBug,
      message: 'Bug marked as resolved'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to resolve bug report' },
      { status: 500 }
    );
  }
}
