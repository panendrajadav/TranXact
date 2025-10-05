import { createContext, useContext, useState, ReactNode } from 'react';

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
      id: "rural-school",
      title: "Rural School Development",
      organization: "Education for All",
      description: "Building new classrooms and providing educational materials for children in remote villages.",
      category: "Education",
      location: "Kenya, East Africa",
      target: 12500,
      raised: 8750,
      backers: 245,
      wallet: "6JSEKQ6JGA56ECOZ25ABSLJVKLDOME3KUGDFKPEQCA3LCNMA5E2ZZNC23E"
    },
    {
      id: "clean-water",
      title: "Clean Water Access Project",
      organization: "Clean Water Initiative",
      description: "Installing water purification systems in communities without access to clean drinking water.",
      category: "Environment",
      location: "Bangladesh",
      target: 18750,
      raised: 17000,
      backers: 412,
      wallet: "OFDV5E5ZTP45MHXCQQ5EHIXAKIJ2BXGMFAAYU6Z2NG4MZTNCB3BOYXIBSQ"
    },
    {
      id: "medical-supplies",
      title: "Emergency Medical Supplies",
      organization: "Healthcare Access",
      description: "Providing essential medical equipment and supplies to rural healthcare centers.",
      category: "Healthcare",
      location: "Guatemala",
      target: 7500,
      raised: 6250,
      backers: 198,
      wallet: "B6JK2QA7LUPS2S7H3Y3L33ROXUFSDJICDJZC4FUJMRJWBXDQJVKL2LCGJM"
    },
    {
      id: "reforestation",
      title: "Reforestation Initiative",
      organization: "Environmental Protection Alliance",
      description: "Planting native trees to restore damaged ecosystems and combat climate change.",
      category: "Environment",
      location: "Brazil",
      target: 25000,
      raised: 6250,
      backers: 156,
      wallet: "PC26UP77QZPOUSTG4O4NG4GOQ3KXFBZ2UPF67XN5JOAYSW4CUKG6ML5VMA"
    },
    {
      id: "child-nutrition",
      title: "Child Nutrition Program",
      organization: "Children's Health Initiative",
      description: "Providing nutritious meals and supplements to undernourished children.",
      category: "Healthcare",
      location: "Ethiopia",
      target: 10000,
      raised: 4500,
      backers: 134,
      wallet: "TBEJZ26MKWXQXTQW5K43DN7NQQA6OGC76DHYIPXDQMDPZF4R3HKFMNZSDI"
    }
  ]);

  const updateProjectFunding = (projectId: string, amount: number) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { 
            ...project, 
            raised: project.raised + amount,
            backers: project.backers + 1
          }
        : project
    ));
  };

  const addProject = (project: Omit<Project, 'id'> & { id: string }) => {
    setProjects(prev => [project, ...prev]);
  };

  const removeProject = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  return (
    <ProjectContext.Provider value={{ projects, updateProjectFunding, addProject, removeProject }}>
      {children}
    </ProjectContext.Provider>
  );
}