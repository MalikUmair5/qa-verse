import { NextRequest, NextResponse } from 'next/server';
import mockData from '@/lib/data/mockData.json';

// GET /api/analytics/user/[id] - Get user analytics
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = mockData.users.find(u => u.id === id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.role === 'tester') {
      // Tester analytics
      const userBugs = mockData.bugReports.filter(b => b.testerId === id);
      
      const analytics = {
        totalBugs: userBugs.length,
        approvedBugs: userBugs.filter(b => b.status === 'Approved').length,
        rejectedBugs: userBugs.filter(b => b.status === 'Rejected').length,
        pendingBugs: userBugs.filter(b => b.status === 'Pending').length,
        resolvedBugs: userBugs.filter(b => b.status === 'Resolved').length,
        totalXP: user.xp,
        successRate: user.stats?.successRate || 0,
        bugsBySeverity: {
          Low: userBugs.filter(b => b.severity === 'Low').length,
          Medium: userBugs.filter(b => b.severity === 'Medium').length,
          High: userBugs.filter(b => b.severity === 'High').length,
          Critical: userBugs.filter(b => b.severity === 'Critical').length
        },
        bugsByCategory: {
          UI: userBugs.filter(b => b.category === 'UI').length,
          Functionality: userBugs.filter(b => b.category === 'Functionality').length,
          Performance: userBugs.filter(b => b.category === 'Performance').length,
          Security: userBugs.filter(b => b.category === 'Security').length
        },
        recentActivity: userBugs.slice(-5).reverse()
      };

      return NextResponse.json({
        success: true,
        data: analytics
      });
    } else {
      // Maintainer analytics
      const maintainerProjects = mockData.projects.filter(p => p.maintainerId === id);
      const projectIds = maintainerProjects.map(p => p.id);
      const projectBugs = mockData.bugReports.filter(b => projectIds.includes(b.projectId));

      const analytics = {
        totalProjects: maintainerProjects.length,
        activeProjects: maintainerProjects.filter(p => p.status === 'Active').length,
        totalBugsReceived: projectBugs.length,
        pendingBugs: projectBugs.filter(b => b.status === 'Pending').length,
        approvedBugs: projectBugs.filter(b => b.status === 'Approved').length,
        resolvedBugs: projectBugs.filter(b => b.status === 'Resolved').length,
        rejectedBugs: projectBugs.filter(b => b.status === 'Rejected').length,
        bugsBySeverity: {
          Low: projectBugs.filter(b => b.severity === 'Low').length,
          Medium: projectBugs.filter(b => b.severity === 'Medium').length,
          High: projectBugs.filter(b => b.severity === 'High').length,
          Critical: projectBugs.filter(b => b.severity === 'Critical').length
        },
        projectStats: maintainerProjects.map(p => ({
          projectId: p.id,
          projectTitle: p.title,
          bugsFound: projectBugs.filter(b => b.projectId === p.id).length,
          bugsResolved: projectBugs.filter(b => b.projectId === p.id && b.status === 'Resolved').length
        }))
      };

      return NextResponse.json({
        success: true,
        data: analytics
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
