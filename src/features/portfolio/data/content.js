import { createGoogleDriveAsset } from '../../../shared/utils/googleDrive';
import codingStats from './coding-stats.json';

export const navigationItems = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#achievements', label: 'Achievements' },
  { href: '#contact', label: 'Contact' },
];

export const socialLinks = [
  { href: 'https://github.com/sha1am', label: 'GitHub', icon: 'github', external: true },
  { href: 'https://www.linkedin.com/in/sha1am/', label: 'LinkedIn', icon: 'linkedin', external: true },
  { href: 'mailto:shadab.connect17@gmail.com', label: 'Email', icon: 'email' },
  { href: 'tel:+919958328345', label: 'Phone', icon: 'phone' },
];

export const heroContent = {
  availability: 'Open to backend engineering roles',
  greeting: "Hello, I'm",
  name: 'Shadab Alam',
  roles: ['Backend Engineer', 'Go & Python Developer', 'Distributed Systems Builder', 'Product-Minded Engineer'],
  summary:
    'I design and ship backend systems that stay correct under load - APIs, event-driven services, and the internal platforms teams depend on every day.',
  summaryPoints: [
    '3+ years building production backend systems in Go and Python.',
    'Focused on APIs, event-driven workflows, and internal platforms that need to stay reliable under scale.',
    'I care about clean architecture, delivery quality, and systems that are easy to extend.',
  ],
  primaryActionLabel: 'View Resume',
  secondaryActionLabel: 'Get In Touch',
};

export const resumeAsset = createGoogleDriveAsset(
  'https://drive.google.com/file/d/1U7jxgyAmCYZg3Fca-T3ySrZcrYZDvDto/view?usp=drivesdk'
);

/**
 * Solved counts come from `coding-stats.json`, which `npm run stats`
 * refreshes from each platform's API at build time (see
 * scripts/fetch-coding-stats.mjs for why this cannot run in the browser).
 * The values below are the fallback used if a platform is unreachable.
 *
 * StrataScratch has no public API, so its count stays manual - update it here.
 */
const PROFILE_FALLBACKS = {
  leetcode: 194,
  codeforces: 153,
  stratascratch: 25,
};

const solvedFor = (key) =>
  codingStats.platforms?.[key]?.problemsSolved ?? PROFILE_FALLBACKS[key];

export const codingStatsUpdatedAt = codingStats.updatedAt;

export const codingProfiles = [
  {
    name: 'LeetCode',
    url: 'https://leetcode.com/u/sha1am/',
    problemsSolved: solvedFor('leetcode'),
    color: '#ffa116',
    logoType: 'leetcode',
  },
  {
    name: 'CodeForces',
    url: 'https://codeforces.com/profile/shalam',
    problemsSolved: solvedFor('codeforces'),
    color: '#29b6f6',
    logoType: 'codeforces',
  },
  {
    name: 'Stratascratch',
    url: 'https://platform.stratascratch.com/user/sha1am',
    problemsSolved: PROFILE_FALLBACKS.stratascratch,
    color: '#66bb6a',
    logoType: 'stratascratch',
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
  title: 'The stack I build with',
  description:
    'Grouped by where each tool actually sits in the systems I ship, rather than as one flat list.',
  groups: [
    { name: 'Languages', items: ['Go', 'Python', 'C++', 'SQL', 'Bash'] },
    { name: 'Frameworks', items: ['Gin', 'Django', 'GraphQL', 'Pandas', 'NumPy'] },
    { name: 'Data', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Kafka'] },
    { name: 'Platform', items: ['Docker', 'Kubernetes', 'AWS', 'Airflow', 'Linux'] },
    { name: 'Tooling', items: ['Git', 'Postman', 'REST APIs', 'Microservices'] },
  ],
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
    range: 'November 2024 - November 2025',
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
  { label: 'Email', value: 'shadab.connect17@gmail.com', href: 'mailto:shadab.connect17@gmail.com', icon: 'email' },
  { label: 'Phone', value: '+91 99583 28345', href: 'tel:+919958328345', icon: 'phone' },
  { label: 'GitHub', value: 'github.com/sha1am', href: 'https://github.com/sha1am', icon: 'github', external: true },
  { label: 'LinkedIn', value: 'linkedin.com/in/sha1am', href: 'https://www.linkedin.com/in/sha1am/', icon: 'linkedin', external: true },
];
