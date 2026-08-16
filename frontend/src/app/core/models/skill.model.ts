export interface Skill {
  id: string;
  label: string;
  level?: number; // 0-100, optional, drives bubble size
  color?: string; // optional accent override
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface Project {
  id: string;
  title: string;
  category?: 'enterprise' | 'personal';
  clientOrContext?: string;
  badge?: string;
  description: string;
  highlights?: string[];
  tags: string[];
  image?: string;
  liveUrl?: string;
  repoUrl?: string;
}

export interface ResumeEntry {
  id: string;
  role: string;
  org: string;
  client?: string;
  location?: string;
  period: string;
  bullets: string[];
  tags?: string[];
}

export interface EducationCert {
  id: string;
  title: string;
  institution: string;
  periodOrDate: string;
  scoreOrDetail?: string;
  type: 'education' | 'certification';
}
