export interface Project {
  id?: number;
  name: string;
  description: string;
  startDate: string; // ISO date string
  endDate: string;
  tasks?: Task[];
}

export interface Task {
  id?: number;
  name: string;
  duration: number;
  done: boolean;
  dueDate?: string;
  projectId?: number;
}