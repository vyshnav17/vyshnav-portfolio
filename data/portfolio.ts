export const profile = {
  name: "Vyshnav T V",
  email: "v17vyshnavtv@gmail.com",
  github: "https://github.com/vyshnav17",
  linkedin: "https://linkedin.com/in/vyshnav-t-v",
  resume: "/Vyshnav-TV-Resume.pdf",
};
export const navigation = [
  ["work", "Work"],
  ["about", "About"],
  ["experience", "Experience"],
  ["stack", "Stack"],
  ["education", "Education"],
] as const;
export type Project = {
  slug: string;
  title: string;
  short: string;
  category: string;
  period: string;
  description: string;
  problem: string;
  solution: string;
  tech: string[];
  implementation: [string, string][];
  features: string[];
  link: string;
  linkName: string;
  image?: string;
};
export const projects: Project[] = [
  {
    slug: "travox",
    title: "Travox Travel Hub",
    short: "Travox",
    category: "Full-stack / Freelance",
    period: "July – August 2026",
    description:
      "A travel planning platform that connects custom itineraries, road-distance quotations, and lead management in one workflow.",
    problem:
      "Planning a custom tour involves several handoffs. Destinations, road distances, vehicle choices, and pricing all have to agree before a travel operator can send a quote.",
    solution:
      "I built a trip builder and an administrative workspace that use the same trip details, from a traveller’s first route selection to the operator’s WhatsApp quotation.",
    tech: [
      "Next.js",
      "Prisma ORM",
      "MongoDB",
      "OpenStreetMap",
      "Nominatim",
      "OSRM",
    ],
    implementation: [
      [
        "Configure",
        "A multi-step builder captures the itinerary and vehicle. Nominatim finds the places selected by the traveller.",
      ],
      [
        "Calculate",
        "OSRM computes road distances. The rental logic applies the selected vehicle’s pricing tiers to the route.",
      ],
      [
        "Follow up",
        "Prisma connects the Next.js application to MongoDB. The CRM brings leads, quote sharing, and margin tracking into the operator’s workspace.",
      ],
    ],
    features: [
      "Custom trip and vehicle selection",
      "Distance-based rental quotations",
      "Lead CRM and profit tracking",
      "One-click WhatsApp quotations",
      "CMS for packages, pricing, and reviews",
    ],
    link: "https://travox-rho.vercel.app/",
    linkName: "Visit live site",
    image: "/work/travox.webp",
  },
  {
    slug: "hospital-system",
    title: "AI-Powered Government Hospital Queue & Resource Management System",
    short: "Hospital queue & resource management",
    category: "Applied AI / Healthcare",
    period: "May – June 2026",
    description:
      "A Django application connecting four hospital roles through assisted triage, queue routing, and bed availability.",
    problem:
      "Patients, clinicians, nurses, and administrators need different views of the same hospital workflow. Queue decisions depend on triage information and the resources available.",
    solution:
      "During my AI & ML internship, I built role-based dashboards that connect patient intake with predictive models, queue management, and resource tracking.",
    tech: ["Django", "Scikit-learn", "Pandas", "NumPy", "SQLite"],
    implementation: [
      [
        "Intake",
        "A patient-facing module brings together symptom input, chatbot support, and telehealth functionality.",
      ],
      [
        "Assess",
        "Predictive health models and assisted triage support the clinical workflow in the doctor dashboard.",
      ],
      [
        "Coordinate",
        "Nursing and administrative modules connect queues, bed tracking, and resource allocation through a Django application backed by SQLite.",
      ],
    ],
    features: [
      "Patient, doctor, nurse, and administrator modules",
      "AI-assisted symptom and trauma triage",
      "Predictive health models",
      "Smart queue routing and bed tracking",
      "AI chatbot and telehealth functionality",
    ],
    link: "https://github.com/vyshnav17/AI-based-Govt-Hospital-Smart-queue-and-Resource-Management-System",
    linkName: "View repository",
  },
  {
    slug: "personalised-learning",
    title: "AI-Personalised Learning Management System",
    short: "Personalised learning platform",
    category: "AI/ML / Education technology",
    period: "December 2025 – January 2026",
    description:
      "An academic mini project that uses learning activity and course progress to recommend what a learner could study next.",
    problem:
      "A fixed course list offers little guidance about what to study next. Learners need a path that takes their activity and progress into account.",
    solution:
      "I connected authentication and course management with ML-based progress tracking to generate recommendations from learner behaviour.",
    tech: ["React", "NestJS", "Prisma ORM", "SQLite", "Vite", "Tailwind CSS"],
    implementation: [
      [
        "Identify",
        "Authentication associates course activity with an individual learner.",
      ],
      [
        "Track",
        "Course management and progress tracking record how the learner moves through the material.",
      ],
      [
        "Recommend",
        "The recommendation workflow uses learning behaviour to suggest relevant content.",
      ],
    ],
    features: [
      "User authentication",
      "Course management",
      "ML-based progress tracking",
      "Behaviour-based recommendations",
    ],
    link: "https://github.com/vyshnav17/AI-personalised-LMS",
    linkName: "View repository",
  },
];
export const experience = [
  {
    date: "JUL — AUG 2026",
    role: "Freelance Developer",
    org: "Travox Travel Hub",
    place: "Kannur, Kerala",
    body: "Delivered an end-to-end tourism platform with custom trip configuration, automated quotations, road routing, lead CRM, and administration tools.",
    type: "Freelance project",
  },
  {
    date: "MAY — JUN 2026",
    role: "AI & ML Intern",
    org: "Inexoft Technologies Pvt Ltd",
    place: "Kannur, Kerala",
    body: "Studied predictive analytics, resource allocation, and automation. Built a four-role government hospital queue and resource management application.",
    type: "Internship",
  },
  {
    date: "JUN — JUL 2025",
    role: "Web Development Intern",
    org: "Verveox Technologies",
    place: "Kollam, Kerala",
    body: "Built interactive web pages using HTML, CSS, JavaScript, and Node.js. Implemented authentication and real-time application features with Firebase.",
    type: "Internship",
  },
];
export const stack = [
  ["Languages", ["Java", "Python", "C++", "JavaScript"]],
  ["Frontend", ["React.js", "Next.js", "Tailwind CSS", "HTML", "CSS"]],
  ["Backend", ["Node.js", "Django", "REST APIs"]],
  ["Databases & services", ["MongoDB", "SQL", "Firebase", "Prisma"]],
  ["AI / ML", ["Scikit-learn", "Pandas", "NumPy"]],
  ["Developer tools", ["Git", "Linux"]],
] as const;
export const certificates = [
  ["IBM", "Python for Data Science"],
  ["IBM", "Business Intelligence"],
  ["IBM", "Hadoop"],
  ["Certiport", "Java IT Specialist"],
  ["IT Specialist", "Artificial Intelligence"],
  ["IBM", "Machine Learning using Python"],
];
