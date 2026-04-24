import { createGoogleDriveAsset } from '../../../shared/utils/googleDrive';

export const navigationItems = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

export const socialLinks = [
  { href: 'https://github.com/sha1am', label: 'GitHub', icon: 'github' },
  { href: 'https://www.linkedin.com/in/sha1am/', label: 'LinkedIn', icon: 'linkedin' },
  { href: 'mailto:shadab.connect@gmail.com', label: 'Email', icon: 'email' },
];

export const heroContent = {
  greeting: "Hello, I'm",
  name: 'Shadab Alam',
  role: 'Software Development Engineer',
  highlights: ['Backend Developer', 'Problem Solver', 'Tech Enthusiast'],
  primaryActionLabel: 'View My Resume',
  secondaryActionLabel: "Let's Build",
};

export const resumeAsset = createGoogleDriveAsset('https://drive.google.com/file/d/18BKUMCl3JeyyVsl-oCXtR-06_udcEysw/view?usp=drivesdk');

export const resumeCards = [
  {
    className: 'resume-page--left',
    title: 'Summary',
    lines: [
      'Backend-focused engineer with practical product sense.',
      'Builds APIs, workflows, and systems for scale.',
      'Strong bias for execution and clarity.',
    ],
  },
  {
    className: 'resume-page--center',
    type: 'preview',
  },
  {
    className: 'resume-page--right',
    title: 'Highlights',
    lines: [
      'Production APIs and platform tooling.',
      'Scalable backend and data-heavy systems.',
      'Hands-on delivery across product and infra.',
    ],
  },
];

export const stats = [
  { label: 'Experience', value: '2+ Years', icon: 'briefcase' },
  { label: 'Projects', value: '3+ Completed', icon: 'code' },
  { label: 'Problems Solved', value: '400+', icon: 'chart' },
  { label: 'Users Impacted', value: '2M+', icon: 'users' },
];

export const aboutSection = {
  eyebrow: 'About',
  title: 'Building polished products from backend logic to user-facing flow.',
  paragraphs: [
    'This rebuild starts from a stronger foundation: a focused hero, better storytelling, clearer sections, and a deployment path that fits Vercel for the frontend and Render for the backend.',
    'The design direction follows the reference closely without cloning it outright. It keeps the dark cinematic tone, floating document stage, blue glow system, and a more intentional visual hierarchy.',
  ],
};

export const skillsSection = {
  eyebrow: 'Skills',
  title: 'Core stack and delivery strengths.',
  items: ['Go', 'Python', 'React', 'JavaScript', 'PostgreSQL', 'Docker', 'Redis', 'Kafka', 'AWS'],
};

export const projectCards = [
  {
    title: 'Resume-Driven Portfolio',
    tag: 'Frontend Experience',
    summary: 'A cinematic portfolio homepage with a floating resume stage, social links, and strong first-impression storytelling.',
  },
  {
    title: 'Data Platforms',
    tag: 'Backend Systems',
    summary: 'Scalable backend services for ingestion, document workflows, and operational tooling across production-grade systems.',
  },
  {
    title: 'Applied ML Workflows',
    tag: 'Intelligent Products',
    summary: 'Prediction and automation pipelines that tie product decisions to measurable impact, throughput, and reliability.',
  },
];

export const experienceCards = [
  {
    range: '2024 - Present',
    role: 'Software Development Engineer',
    company: 'Building backend-heavy products',
    points: [
      'Designed APIs and async workflows for data-rich applications.',
      'Improved throughput and reliability on document and reporting pipelines.',
    ],
  },
  {
    range: '2023 - 2024',
    role: 'Backend Developer',
    company: 'Shipping APIs, automation, and analytics systems',
    points: [
      'Worked across Go, Python, SQL, and product-facing tooling.',
      'Took features from implementation to deployment with practical ownership.',
    ],
  },
];

export const contactCards = [
  { label: 'Email', value: 'shadab.connect@gmail.com', href: 'mailto:shadab.connect@gmail.com' },
  { label: 'GitHub', value: 'github.com/sha1am', href: 'https://github.com/sha1am' },
  { label: 'LinkedIn', value: 'linkedin.com/in/sha1am', href: 'https://www.linkedin.com/in/sha1am/' },
];
