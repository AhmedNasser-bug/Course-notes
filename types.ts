
export interface Note {
  id: string;
  title: string;
  content: string;
  summary: string;
  fileName?: string;
  createdAt: string;
  tags: string[];
}

export interface Course {
  id: string;
  name: string;
  description: string;
  notes: Note[];
}

export interface User {
  id: string;
  email: string;
  password?: string;
}
