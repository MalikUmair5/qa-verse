// TypeScript types for API responses

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'tester' | 'maintainer' | 'admin';
  profilePicture?: string;
  xp?: number;
  rank?: number;
  joinedDate: string;
  badges?: string[];
  stats?: TesterStats | MaintainerStats;
}

export interface TesterStats {
  totalBugs: number;
  approvedBugs: number;
  rejectedBugs: number;
  successRate: number;
  projectsTested: number;
}

export interface MaintainerStats {
  totalProjects: number;
  totalBugsReceived: number;
  resolvedBugs: number;
  pendingBugs: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Web' | 'Mobile' | 'Desktop';
  techStack: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  testingUrl: string;
  githubUrl?: string;
  status: 'Active' | 'Paused' | 'Completed';
  maintainerId: string;
  maintainerName: string;
  createdDate: string;
  testingFocus: string[];
  testingInstructions?: string;
  focusAreas?: string[];
  participants: number;
  bugsFound: number;
  bugsResolved: number;
  image?: string;
}

export interface BugReport {
  id: string;
  projectId: string;
  projectTitle: string;
  testerId: string;
  testerName: string;
  title: string;
  description: string;
  category: 'UI' | 'Functionality' | 'Performance' | 'Security';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'Approved' | 'Rejected' | 'Resolved';
  stepsToReproduce: string[];
  expectedBehavior: string;
  actualBehavior: string;
  attachments: Attachment[];
  xpAwarded: number;
  createdDate: string;
  updatedDate: string;
  rejectionReason?: string;
  comments: Comment[];
}

export interface Attachment {
  type: 'image' | 'video' | 'file';
  url: string;
  name: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userRole: 'tester' | 'maintainer';
  comment: string;
  createdDate: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'bug_approved' | 'bug_rejected' | 'comment' | 'badge_earned' | 'new_bug';
  title: string;
  message: string;
  read: boolean;
  createdDate: string;
  relatedId: string;
  relatedType: 'bug' | 'project' | 'badge';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'milestone' | 'discovery' | 'specialty' | 'competitive' | 'collaboration';
  xpRequired: number;
  level: number;
  earned?: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'tester' | 'maintainer';
  receiverId: string;
  message: string;
  createdDate: string;
  read: boolean;
}

export interface Conversation {
  conversationId: string;
  otherUserId: string;
  otherUserName: string;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  profilePicture?: string;
  xp: number;
  bugsFound: number;
  badges: number;
}

export interface UserAnalytics {
  totalBugs?: number;
  approvedBugs?: number;
  rejectedBugs?: number;
  pendingBugs?: number;
  resolvedBugs?: number;
  totalXP?: number;
  successRate?: number;
  bugsBySeverity?: {
    Low: number;
    Medium: number;
    High: number;
    Critical: number;
  };
  bugsByCategory?: {
    UI: number;
    Functionality: number;
    Performance: number;
    Security: number;
  };
  recentActivity?: BugReport[];
  // Maintainer specific
  totalProjects?: number;
  activeProjects?: number;
  totalBugsReceived?: number;
  projectStats?: Array<{
    projectId: string;
    projectTitle: string;
    bugsFound: number;
    bugsResolved: number;
  }>;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
