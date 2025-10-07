import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, Task } from '../models/project.model';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:8080/projects';

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    console.log("getProjects called");
    return this.http.get<Project[]>(this.apiUrl);
  }

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  updateProject(id: number, project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, project);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  createTask(projectId: number, task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/${projectId}/tasks`, task);
  }

  getTasks(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/${projectId}/tasks`);
  }

  updateTask(projectId: number, taskId: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${projectId}/tasks/${taskId}`, task);
  }

  deleteTask(projectId: number, taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projectId}/tasks/${taskId}`);
  }

  // Gestion des dépendances
  addPredecessor(projectId: number, taskId: number, predecessorId: number): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/${projectId}/tasks/${taskId}/predecessors/${predecessorId}`, {});
  }

  removePredecessor(projectId: number, taskId: number, predecessorId: number): Observable<Task> {
    return this.http.delete<Task>(`${this.apiUrl}/${projectId}/tasks/${taskId}/predecessors/${predecessorId}`);
  }

  updateTaskPredecessors(projectId: number, taskId: number, predecessorIds: number[]): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${projectId}/tasks/${taskId}/predecessors`, predecessorIds);
  }

  recalculateProjectDates(projectId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${projectId}/recalculate-dates`, {});
  }
}
