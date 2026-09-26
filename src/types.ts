export type Slide3DMode = 'coverflow' | 'cylinder' | 'floating-stack';

export interface Memory {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  location: string;
  quote: string;
  personalNote: string;
  imageUrl?: string;
  colorAccent: string;
  tag: string;
  mood: string;
}

export interface LoveMilestone {
  label: string;
  value: string;
  description: string;
  iconName: string;
}
