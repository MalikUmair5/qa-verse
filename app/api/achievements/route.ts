import { NextRequest, NextResponse } from 'next/server';
import mockData from '@/lib/data/mockData.json';

// GET /api/achievements - Get all achievements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Return all achievements
    const achievements = mockData.achievements;

    // If userId provided, mark which badges user has earned
    if (userId) {
      const user = mockData.users.find(u => u.id === userId);
      const userBadges = user?.badges || [];

      const achievementsWithProgress = achievements.map(ach => ({
        ...ach,
        earned: userBadges.includes(ach.id)
      }));

      return NextResponse.json({
        success: true,
        data: achievementsWithProgress
      });
    }

    return NextResponse.json({
      success: true,
      data: achievements
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}
