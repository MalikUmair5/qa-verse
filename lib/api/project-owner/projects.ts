import axiosInstance from '../axiosInstance';

export interface ProjectPayload {
  title: string;
  description: string;
  instructions: string[];
  technology_stack: string;
  testing_url: string;
  category: 'web' | 'mobile' | 'api' | 'desktop';
  status: 'active' | 'inactive' | 'completed';
}



export interface ProjectInterface {
  id: string;
  maintainer: {
    id: string;
    email: string;
    fullname: string;
    role: string;
    bio: string | null;
    avatar_url: string | null;
    github_url: string | null;
    linkedin_url: string | null;
  };
  title: string;
  description: string;
  instructions: string[];
  technology_stack: string;
  testing_url: string;
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProjectInterface[];
}

export async function createProject(payload: ProjectPayload): Promise<ProjectInterface> {
  try {
    const response = await axiosInstance.post<ProjectInterface>(
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

export async function getProjects(): Promise<ProjectResponse> {
  try {
    const response = await axiosInstance.get<ProjectResponse>('/projects/');
    
    if (response.status !== 200) {
      throw new Error('Failed to fetch projects');
    }
    
    return response.data;
  } catch (error: unknown) {
    console.error('Get projects error:', error);
    throw error;
  }
}

export async function getMaintainedProjects(): Promise<ProjectInterface[]> {
  try {
    const response = await axiosInstance.get<ProjectInterface[]>('/projects/maintained/');
    
    if (response.status !== 200) {
      throw new Error('Failed to fetch maintained projects');
    }
    
    return response.data;
  } catch (error: unknown) {
    console.error('Get maintained projects error:', error);
    throw error;
  }
}

export async function getProjectById(id: string): Promise<ProjectInterface> {
  try {
    const response = await axiosInstance.get<ProjectInterface>(`/projects/${id}/`);
    
    if (response.status !== 200) {
      throw new Error('Failed to fetch project');
    }
    
    return response.data;
  } catch (error: unknown) {
    console.error('Get project by ID error:', error);
    throw error;
  }
}

// Alias for consistency with usage in components
export const getProject = getProjectById;

export async function updateProject(id: string, payload: Partial<ProjectPayload>): Promise<ProjectInterface> {
  try {
    const response = await axiosInstance.patch<ProjectInterface>(
      `/projects/${id}/`,
      payload
    );
    
    if (response.status !== 200) {
      throw new Error('Failed to update project');
    }
    
    return response.data;
  } catch (error: unknown) {
    console.error('Update project error:', error);
    throw error;
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    const response = await axiosInstance.delete(`/projects/${id}/`);
    
    if (response.status !== 204 && response.status !== 200) {
      throw new Error('Failed to delete project');
    }
  } catch (error: unknown) {
    console.error('Delete project error:', error);
    throw error;
  }
}