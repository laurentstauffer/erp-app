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
  startDate?: string; // ISO date string
  dueDate?: string;
  done: boolean;
  status?: TaskStatus;
  projectId?: number;
  predecessorIds?: number[];
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  BLOCKED = 'BLOCKED',
  COMPLETED = 'COMPLETED'
}
