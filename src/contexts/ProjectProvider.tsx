import { createContext, useContext, useState, ReactNode } from 'react';
import { projectService } from '@/lib/projectService';

interface Project {
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
}

interface ProjectContextType {
  projects: Project[];
  updateProjectFunding: (projectId: string, amount: number) => Promise<void>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  addProject: (project: Omit<Project, 'id'> & { id: string }) => void;
  removeProject: (projectId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "project001",
      title: "Rural Development",
      organization: "Rural Development Foundation",
      description: "Supporting rural communities with infrastructure development and livelihood programs.",
      category: "Community Development",
      location: "Rural Areas",
      target: 5,
      raised: 8500,
      backers: 180,
      wallet: "C357R4KJBSBYRAE4XGV4LVNW5RR3AELXTTWNVEGJIEDK3HAM2GTIJTH5RU"
    },
    {
      id: "project002",
      title: "Emergency Food Supplies",
      organization: "Food Security Initiative",
      description: "Providing emergency food supplies to communities affected by natural disasters and food insecurity.",
      category: "Food Security",
      location: "Disaster-affected Areas",
      target: 5,
      raised: 7200,
      backers: 220,
      wallet: "U6XN23YTKDI6UT3FAE5ZIGJSOHUGHLI4Z4G5V77RPUSI3P5USYW5JFKH3I"
    },
    {
      id: "project003",
      title: "Child Healthcare",
      organization: "Children's Health Foundation",
      description: "Providing essential healthcare services and medical support for children in underserved communities.",
      category: "Healthcare",
      location: "Underserved Communities",
      target: 5,
      raised: 9500,
      backers: 165,
      wallet: "Q2DY24TCFJHIFQO7QAPKMETED5BKKVKQ7UVOCIEREIUUZ7DDKMZMJ2RHRI"
    }
  ]);

  const updateProjectFunding = async (projectId: string, amount: number) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updates = {
      raised: project.raised + amount,
      backers: project.backers + 1
    };

    try {
      // Update in database
      await projectService.updateProject(projectId, { ...project, ...updates });
      
      // Update local state
      setProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, ...updates } : p
      ));
    } catch (error) {
      console.error('Failed to update project funding:', error);
    }
  };

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedProject = {
      ...project,
      ...updates,
      id: projectId,
      createdAt: project.createdAt || new Date().toISOString(),
      status: project.status || 'active'
    };

    try {
      // Update in database
      await projectService.updateProject(projectId, updatedProject);
      
      // Update local state
      setProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, ...updates } : p
      ));
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  };

  const addProject = (project: Omit<Project, 'id'> & { id: string }) => {
    setProjects(prev => [project, ...prev]);
  };

  const removeProject = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  return (
    <ProjectContext.Provider value={{ projects, updateProjectFunding, updateProject, addProject, removeProject }}>
      {children}
    </ProjectContext.Provider>
  );
}