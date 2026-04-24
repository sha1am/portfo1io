import { createGoogleDriveAsset } from '../../../shared/utils/googleDrive';

export const navigationItems = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#achievements', label: 'Achievements' },
  { href: '#contact', label: 'Contact' },
];

export const socialLinks = [
  { href: 'https://github.com/sha1am', label: 'GitHub', icon: 'github' },
  { href: 'https://www.linkedin.com/in/sha1am/', label: 'LinkedIn', icon: 'linkedin' },
  { href: 'mailto:shadab.connect17@gmail.com', label: 'Email', icon: 'email' },
  { href: 'tel:+919958328345', label: 'Phone', icon: 'phone' },
];

export const heroContent = {
  greeting: "Hello, I'm",
  name: 'Shadab Alam',
  roles: ['Backend Engineer', 'Go & Python Developer', 'Distributed Systems Builder', 'Product-Minded Engineer'],
  summaryPoints: [
    '3+ years building production backend systems in Go and Python.',
    'Improved throughput 2x in document processing and reduced false positives by 20%.',
    'Built services used by 2M+ users with a focus on reliability, scale, and developer velocity.',
  ],
  primaryActionLabel: 'View Resume',
  secondaryActionLabel: 'Get In Touch',
};

export const resumeAsset = createGoogleDriveAsset('https://drive.google.com/file/d/18BKUMCl3JeyyVsl-oCXtR-06_udcEysw/view?usp=drivesdk');

export const resumeCards = [
  {
    className: 'resume-page--center',
    type: 'preview',
  },
];

export const stats = [
  { label: 'Experience', value: '3+ Years', icon: 'briefcase' },
  { label: 'Problems Solved', value: '400+', icon: 'code' },
  { label: 'Users Reached', value: '2M+', icon: 'users' },
  { label: 'Throughput Gain', value: '2x', icon: 'chart' },
];

export const aboutSection = {
  eyebrow: 'About',
  title: 'Backend-focused software engineer with product sense, systems depth, and measurable delivery.',
  paragraphs: [
    'I build backend systems that have to stay correct under pressure: compliance workflows, event-driven services, reporting pipelines, and internal platforms that teams rely on every day.',
    'My strongest work sits at the intersection of application engineering and data-heavy problem solving. I care about throughput, correctness, operability, and whether the system is still easy for the next engineer to extend.',
    'This portfolio is structured as a deployable product rather than a static gallery so reviewers can evaluate both implementation quality and engineering decisions.',
  ],
};

export const skillsSection = {
  eyebrow: 'Skills',
  title: 'Core technical skills and production experience.',
  items: ['Go (Golang)', 'Python', 'C++', 'SQL', 'HTML5', 'CSS3', 'Django', 'Gin', 'Pandas', 'NumPy', 'Docker', 'Kubernetes', 'AWS', 'MySQL', 'PostgreSQL', 'MongoDB', 'GraphQL', 'Redis', 'Bash', 'Linux', 'Git', 'Postman'],
};

export const projectCards = [
  {
    title: 'ByteVault: Full-stack File Management',
    tag: 'Full-Stack Application',
    summary: 'Secure file hosting platform with deduplication, advanced search & filtering, React hooks with query caching, and scalable REST APIs in Django.',
    links: {
      website: 'https://byte-vault-fort.vercel.app/',
      github: 'https://github.com/sha1am/ByteVault'
    }
  },
  {
    title: 'GreenWave: Smart Traffic Router',
    tag: 'Computer Vision Project',
    summary: 'Live video streaming application for optimizing vehicle routing at traffic signals with scheduling algorithm to reduce waiting times and carbon footprint.',
    links: {
      website: 'https://drive.google.com/file/d/1Y80xR8pfJcM0fsc5lOouxO5SEdeLpYfV/view',
      github: 'https://github.com/sha1am/MajorProject2023'
    }
  },
  {
    title: 'Interactive 3D Portfolio',
    tag: 'Frontend Experience',
    summary: 'Cinematic portfolio with 3D resume interactions, hover-to-expand functionality, and smooth animations built with React and modern CSS.',
  },
];

export const experienceCards = [
  {
    range: 'Nov 2025 - Present',
    role: 'Software Engineer',
    company: 'Trademo',
    location: 'India · On-site',
    points: [
      'Building scalable backend infrastructure powering global trade compliance workflows.',
      'Implemented ACL-driven access control in User Management System (UMS), enabling secure, granular role and permission management across multiple Trademo products.',
      'Designed, built, and optimized the Tradescreen Service — an LC document screening engine processing 8,000+ documents/day using hybrid rule-based and ML-assisted pipeline.',
      'Achieved 2x throughput improvement and 20% reduction in false positives in document screening.',
    ],
    techStack: ['Python', 'Go', 'REST APIs', 'Microservices', 'Docker', 'AWS', 'PostgreSQL', 'MySQL', 'Kubernetes'],
  },
  {
    range: 'November 2024 - Present',
    role: 'SDE-1 Backend',
    company: 'Park+',
    location: 'India · On-site',
    points: [
      'Owned and maintained 3 core backend services for the Park+ app serving 2 crore+ car owners across India.',
      'Managed a Golang and Kafka notification service for high-throughput customer engagement delivery.',
      'Led development of the Help & Support platform with a Python rule engine to streamline support operations.',
      'Designed and maintained a report delivery service in Python and Kafka for scalable inter-service reporting workflows.',
    ],
    techStack: ['Go', 'Python', 'Kafka', 'Microservices', 'AWS'],
  },
  {
    range: 'June 2023 - August 2024',
    role: 'Python Developer',
    company: 'Viveja IT Services',
    location: 'India',
    points: [
      'Built scalable account monitoring dashboard with Python/Django and integrated ML models into production using Docker and Airflow.',
      'Improved system performance by 40% and reliability by 30% through optimization and architectural improvements.',
      'Integrated ML models into production systems with Dockerized delivery and Airflow-based orchestration.',
      'Contributed through code reviews and operational support to improve system uptime and delivery quality.',
    ],
    techStack: ['Python', 'Django', 'Docker', 'Airflow', 'SQL'],
  },
];

export const achievementsSection = {
  eyebrow: 'Achievements',
  title: 'Academic excellence and professional recognition.',
  items: [
    {
      title: 'Solved 400+ Algorithmic Problems',
      description: 'Across competitive programming platforms including LeetCode, Codeforces, and StrataScratch'
    },
    {
      title: '50% Tuition Merit Scholarship',
      description: 'Received INR 5,00,000 during B.Tech for consistent academic excellence (2019–2023)'
    },
    {
      title: 'CBSE Class XII Board Topper',
      description: 'Achieved 93% aggregate; recognized for academic excellence (2018)'
    },
    {
      title: 'CBSE Class X Board Topper',
      description: 'Secured perfect 10 CGPA; awarded for academic distinction (2016)'
    }
  ]
};

export const contactCards = [
  { label: 'Email', value: 'shadab.connect17@gmail.com', href: 'mailto:shadab.connect17@gmail.com' },
  { label: 'GitHub', value: 'github.com/sha1am', href: 'https://github.com/sha1am' },
  { label: 'LinkedIn', value: 'linkedin.com/in/sha1am', href: 'https://www.linkedin.com/in/sha1am/' },
  { label: 'Phone', value: '+91-9958328345', href: 'tel:+919958328345' },
];
