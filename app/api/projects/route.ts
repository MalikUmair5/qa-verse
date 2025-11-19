import { NextRequest, NextResponse } from 'next/server';
import mockData from '@/lib/data/mockData.json';

// GET /api/projects - Get all projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');

    let filteredProjects = [...mockData.projects];

    // Filter by category
    if (category && category !== 'all') {
      filteredProjects = filteredProjects.filter(p => p.category === category);
    }

    // Filter by difficulty
    if (difficulty && difficulty !== 'all') {
      filteredProjects = filteredProjects.filter(p => p.difficulty === difficulty);
    }

    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProjects = filteredProjects.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredProjects
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newProject = {
      id: String(mockData.projects.length + 1),
      ...body,
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0],
      participants: 0,
      bugsFound: 0,
      bugsResolved: 0,
      image: '/window.svg'
    };

    return NextResponse.json({
      success: true,
      data: newProject
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
