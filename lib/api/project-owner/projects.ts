import axiosInstance from '../axiosInstance';

export interface ProjectPayload {
  title: string;
  description: string;
  technology_stack: string;
  testing_url: string;
  category: 'web' | 'mobile' | 'api' | 'desktop';
  status: 'active' | 'inactive' | 'completed';
}

export interface ProjectResponse {
  id: number;
  maintainer: {
    id: number;
    email: string;
    fullname: string;
    role: string;
    bio: string;
    avatar: string | null;
    github_url: string;
    linkedin_url: string;
  };
  title: string;
  description: string;
  technology_stack: string;
  testing_url: string;
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export async function createProject(payload: ProjectPayload): Promise<ProjectResponse> {
  try {
    const response = await axiosInstance.post<ProjectResponse>(
      '/projects/',
      payload
    );
    
    if (response.status !== 201) {
      throw new Error('Failed to create project');
    }
    
    return response.data;
  } catch (error: unknown) {
    console.error('Create project error:', error);
    throw error;
  }
}

export async function getProjects(): Promise<ProjectResponse[]> {
  try {
    const response = await axiosInstance.get<ProjectResponse[]>('/projects/');
    
    if (response.status !== 200) {
      throw new Error('Failed to fetch projects');
    }
    
    return response.data;
  } catch (error: unknown) {
    console.error('Get projects error:', error);
    throw error;
  }
}

export async function getProjectById(id: number): Promise<ProjectResponse> {
  try {
    const response = await axiosInstance.get<ProjectResponse>(`/projects/${id}/`);
    
    if (response.status !== 200) {
      throw new Error('Failed to fetch project');
    }
    
    return response.data;
  } catch (error: unknown) {
    console.error('Get project by ID error:', error);
    throw error;
  }
}