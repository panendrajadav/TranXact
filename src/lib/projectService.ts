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

export const projectService = {
  // Create new project
  async createProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...project,
        id: `project_${Date.now()}`,
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