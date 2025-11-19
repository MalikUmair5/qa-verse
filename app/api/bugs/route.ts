import { NextRequest, NextResponse } from 'next/server';
import mockData from '@/lib/data/mockData.json';

// GET /api/bugs - Get all bug reports
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const testerId = searchParams.get('testerId');
    const status = searchParams.get('status');
    const severity = searchParams.get('severity');

    let filteredBugs = [...mockData.bugReports];

    // Filter by project
    if (projectId) {
      filteredBugs = filteredBugs.filter(b => b.projectId === projectId);
    }

    // Filter by tester
    if (testerId) {
      filteredBugs = filteredBugs.filter(b => b.testerId === testerId);
    }

    // Filter by status
    if (status && status !== 'all') {
      filteredBugs = filteredBugs.filter(b => b.status === status);
    }

    // Filter by severity
    if (severity && severity !== 'all') {
      filteredBugs = filteredBugs.filter(b => b.severity === severity);
    }

    return NextResponse.json({
      success: true,
      data: filteredBugs
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bug reports' },
      { status: 500 }
    );
  }
}

// POST /api/bugs - Create new bug report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newBug = {
      id: String(mockData.bugReports.length + 1),
      ...body,
      status: 'Pending',
      xpAwarded: 0,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      comments: []
    };

    return NextResponse.json({
      success: true,
      data: newBug
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create bug report' },
      { status: 500 }
    );
  }
}
