import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { TransactionAPI } from '@/lib/transactionAPI';

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
  updateProjectFunding: (projectId: string, amount: number) => void;
  addProject: (project: Omit<Project, 'id'> & { id: string }) => void;
  removeProject: (projectId: string) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
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
  const [projects, setProjects] = useState<Project[]>([]);

  // Load projects from database on mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/projects');
        if (response.ok) {
          const dbProjects = await response.json();
          setProjects(dbProjects);
        } else {
          // Fallback to default projects if DB is empty
          const defaultProjects = [
            {
              id: "rural-development",
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
              id: "emergency-food",
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
              id: "child-healthcare",
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
          ];
          // Store default projects in DB
          for (const project of defaultProjects) {
            await TransactionAPI.storeProject(project);
          }
          setProjects(defaultProjects);
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
      }
    };
    
    loadProjects();
  }, []);

  const updateProjectFunding = (projectId: string, amount: number) => {
    // Update local state
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { 
            ...project, 
            raised: project.raised + amount,
            backers: project.backers + 1
          }
        : project
    ));
    
    // Update in database (non-blocking)
    TransactionAPI.updateProjectFunding(projectId, amount)
      .catch(error => console.error('Failed to update project funding in DB:', error));
  };

  const addProject = async (project: Omit<Project, 'id'> & { id: string }) => {
    try {
      await TransactionAPI.storeProject(project);
      // Reload projects from database after adding
      const response = await fetch('http://localhost:3002/api/projects');
      if (response.ok) {
        const updatedProjects = await response.json();
        setProjects(updatedProjects);
      }
    } catch (error) {
      console.error('Failed to add project:', error);
    }
  };

  const removeProject = (projectId: string) => {
    // For now, just remove from local state since we don't have delete endpoint
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      await TransactionAPI.updateProject(projectId, updates);
      // Reload projects from database after update
      const response = await fetch('http://localhost:3002/api/projects');
      if (response.ok) {
        const updatedProjects = await response.json();
        setProjects(updatedProjects);
      }
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  };

  return (
    <ProjectContext.Provider value={{ projects, updateProjectFunding, addProject, removeProject, updateProject }}>
      {children}
    </ProjectContext.Provider>
  );
}