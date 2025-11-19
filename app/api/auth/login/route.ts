import { NextRequest, NextResponse } from 'next/server';
import mockData from '@/lib/data/mockData.json';

// POST /api/auth/login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Mock authentication logic
    const user = mockData.users.find(u => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // In real implementation, verify password hash
    // For demo, just return user data with token
    return NextResponse.json({
      success: true,
      data: {
        user,
        token: 'mock-jwt-token-' + user.id
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
