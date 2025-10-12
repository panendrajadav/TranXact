const API_BASE_URL = 'http://localhost:3002/api';

export interface Project {
  id: string;
  title: string;
  organization: string;
  description: string;
  category: string;
  location: string;
  target: number;
  raised: number;
  backers: number;
  wallet: string;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

// Generate next project ID
async function getNextProjectId(): Promise<string> {
  try {
    const projects = await projectService.getProjects();
    const projectNumbers = projects
      .map(p => p.id)
      .filter(id => id.startsWith('project'))
      .map(id => parseInt(id.replace('project', '')))
      .filter(num => !isNaN(num));
    
    const maxNumber = projectNumbers.length > 0 ? Math.max(...projectNumbers) : 0;
    return `project${String(maxNumber + 1).padStart(3, '0')}`;
  } catch {
    return 'project001';
  }
}

export const projectService = {
  // Create new project
  async createProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    const id = await getNextProjectId();
    
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...project,
        id,
        createdAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create project');
    }

    return response.json();
  },

  // Get all projects
  async getProjects(): Promise<Project[]> {
    const response = await fetch(`${API_BASE_URL}/projects`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    return response.json();
  },

  // Update project
  async updateProject(projectId: string, project: Partial<Project>): Promise<Project> {
    console.log('API call - updating project:', projectId, project);
    
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });

    console.log('API response status:', response.status);
    
    if (!response.ok) {
      throw new Error('Failed to update project');
    }

    const result = await response.json();
    console.log('API response data:', result);
    return result;
  },

  // Delete project
  async deleteProject(projectId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
  },
};