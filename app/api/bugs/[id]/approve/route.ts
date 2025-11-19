import { NextRequest, NextResponse } from 'next/server';
import mockData from '@/lib/data/mockData.json';

// POST /api/bugs/[id]/approve - Approve a bug report
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

    // Calculate XP based on severity
    const xpMap = {
      'Low': 10,
      'Medium': 30,
      'High': 50,
      'Critical': 100
    };

    const updatedBug = {
      ...bug,
      status: 'Approved',
      xpAwarded: xpMap[bug.severity as keyof typeof xpMap] || 30,
      updatedDate: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: updatedBug,
      message: 'Bug report approved successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to approve bug report' },
      { status: 500 }
    );
  }
}
