import { NextRequest, NextResponse } from 'next/server';
import mockData from '@/lib/data/mockData.json';

// POST /api/auth/register
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    // Check if user already exists
    const existingUser = mockData.users.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create new user (mock)
    const newUser = {
      id: String(mockData.users.length + 1),
      email,
      name,
      role,
      profilePicture: '/avatars/default.jpg',
      xp: role === 'tester' ? 0 : undefined,
      rank: role === 'tester' ? mockData.users.filter(u => u.role === 'tester').length + 1 : undefined,
      joinedDate: new Date().toISOString().split('T')[0],
      badges: [],
      stats: role === 'tester' 
        ? {
            totalBugs: 0,
            approvedBugs: 0,
            rejectedBugs: 0,
            successRate: 0,
            projectsTested: 0
          }
        : {
            totalProjects: 0,
            totalBugsReceived: 0,
            resolvedBugs: 0,
            pendingBugs: 0
          }
    };

    return NextResponse.json({
      success: true,
      data: {
        user: newUser,
        token: 'mock-jwt-token-' + newUser.id
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
