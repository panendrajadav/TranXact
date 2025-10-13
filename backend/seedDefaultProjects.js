const { database } = require('./config/cosmos');

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

async function seedProjects() {
  try {
    const projectContainer = database.container('projects');
    
    for (const project of defaultProjects) {
      await projectContainer.items.upsert(project);
      console.log(`Seeded project: ${project.title}`);
    }
    
    console.log('All projects seeded successfully!');
  } catch (error) {
    console.error('Error seeding projects:', error);
  }
}

seedProjects();