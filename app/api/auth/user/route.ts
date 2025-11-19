import { NextRequest, NextResponse } from 'next/server';
import mockData from '@/lib/data/mockData.json';

// GET /api/auth/user - Get current user
export async function GET() {
  try {
    // Simulate authentication - return first tester for demo
    const user = mockData.users.find(u => u.role === 'tester');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
