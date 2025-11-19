import { NextRequest, NextResponse } from 'next/server';
import mockData from '@/lib/data/mockData.json';

// GET /api/bugs/[id] - Get a specific bug report
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
      data: bug
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bug report' },
      { status: 500 }
    );
  }
}

// PUT /api/bugs/[id] - Update bug report
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const bug = mockData.bugReports.find(b => b.id === id);

    if (!bug) {
      return NextResponse.json(
        { error: 'Bug report not found' },
        { status: 404 }
      );
    }

    const updatedBug = {
      ...bug,
      ...body,
      updatedDate: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: updatedBug
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update bug report' },
      { status: 500 }
    );
  }
}

// DELETE /api/bugs/[id] - Delete a bug report
export async function DELETE(
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
      message: 'Bug report deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete bug report' },
      { status: 500 }
    );
  }
}
