import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskFormComponent } from './task-form.component';
import { ProjectService } from '../../services/project.service';
import { of, throwError } from 'rxjs';
import { Task } from '../../models/project.model';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let mockProjectService: jasmine.SpyObj<ProjectService>;

  beforeEach(async () => {
    mockProjectService = jasmine.createSpyObj('ProjectService', ['createTask']);

    await TestBed.configureTestingModule({
      imports: [TaskFormComponent, ReactiveFormsModule],
      providers: [
        { provide: ProjectService, useValue: mockProjectService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    component.projectId = 1; // Set required input
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.taskForm).toBeDefined();
    expect(component.taskForm.get('name')?.value).toBe('');
    expect(component.taskForm.get('duration')?.value).toBe(1);
    expect(component.taskForm.get('done')?.value).toBe(false);
    expect(component.taskForm.get('dueDate')?.value).toBe('');
  });

  describe('Form Validations', () => {
    it('should invalidate form when name is empty', () => {
      component.taskForm.patchValue({ name: '' });
      expect(component.name?.hasError('required')).toBeTruthy();
      expect(component.taskForm.invalid).toBeTruthy();
    });

    it('should invalidate form when name is too short', () => {
      component.taskForm.patchValue({ name: 'AB' });
      expect(component.name?.hasError('minlength')).toBeTruthy();
      expect(component.taskForm.invalid).toBeTruthy();
    });

    it('should validate form when name is valid', () => {
      component.taskForm.patchValue({ name: 'Valid Task Name' });
      expect(component.name?.hasError('minlength')).toBeFalsy();
      expect(component.name?.hasError('required')).toBeFalsy();
    });

    it('should invalidate form when duration is empty', () => {
      component.taskForm.patchValue({ 
        name: 'Valid Name',
        duration: null 
      });
      expect(component.duration?.hasError('required')).toBeTruthy();
      expect(component.taskForm.invalid).toBeTruthy();
    });

    it('should invalidate form when duration is less than minimum', () => {
      component.taskForm.patchValue({ 
        name: 'Valid Name',
        duration: 0 
      });
      expect(component.duration?.hasError('min')).toBeTruthy();
      expect(component.taskForm.invalid).toBeTruthy();
    });

    it('should validate form when duration is valid', () => {
      component.taskForm.patchValue({ 
        name: 'Valid Name',
        duration: 5 
      });
      expect(component.duration?.hasError('min')).toBeFalsy();
      expect(component.duration?.hasError('required')).toBeFalsy();
    });

    it('should validate form when all required fields are filled correctly', () => {
      component.taskForm.patchValue({
        name: 'Valid Task',
        duration: 3.5,
        done: false,
        dueDate: '2025-12-31'
      });
      expect(component.taskForm.valid).toBeTruthy();
    });

    it('should allow optional dueDate to be empty', () => {
      component.taskForm.patchValue({
        name: 'Valid Task',
        duration: 2,
        done: false,
        dueDate: ''
      });
      expect(component.taskForm.valid).toBeTruthy();
    });
  });

  describe('Form Getters', () => {
    it('should return name form control', () => {
      expect(component.name).toBe(component.taskForm.get('name'));
    });

    it('should return duration form control', () => {
      expect(component.duration).toBe(component.taskForm.get('duration'));
    });
  });

  describe('createTask', () => {
    it('should not submit when form is invalid', () => {
      component.taskForm.patchValue({ name: '' });
      component.createTask();
      expect(mockProjectService.createTask).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched when form is invalid', () => {
      component.taskForm.patchValue({ name: '' });
      component.createTask();
      expect(component.taskForm.get('name')?.touched).toBeTruthy();
    });

    it('should call createTask with correct data when form is valid', () => {
      mockProjectService.createTask.and.returnValue(of({} as Task));
      
      component.projectId = 5;
      component.taskForm.patchValue({
        name: 'New Task',
        duration: 4,
        done: false,
        dueDate: '2025-06-15'
      });

      component.createTask();

      expect(mockProjectService.createTask).toHaveBeenCalledWith(5, {
        name: 'New Task',
        duration: 4,
        done: false,
        dueDate: '2025-06-15',
        projectId: 5
      });
    });

    it('should display success message on successful creation', () => {
      mockProjectService.createTask.and.returnValue(of({} as Task));
      
      component.taskForm.patchValue({
        name: 'New Task',
        duration: 2,
        done: false
      });

      component.createTask();

      expect(component.successMessage).toBe('Tâche ajoutée avec succès !');
      expect(component.errorMessage).toBe('');
    });

    it('should reset form with default values on successful creation', () => {
      mockProjectService.createTask.and.returnValue(of({} as Task));

      component.taskForm.patchValue({
        name: 'New Task',
        duration: 5,
        done: true,
        dueDate: '2025-06-15'
      });

      component.createTask();

      expect(component.taskForm.get('name')?.value).toBeNull();
      expect(component.taskForm.get('duration')?.value).toBe(1);
      expect(component.taskForm.get('done')?.value).toBe(false);
      expect(component.taskForm.get('dueDate')?.value).toBeNull();
    });

    it('should display error message on creation failure', () => {
      mockProjectService.createTask.and.returnValue(throwError(() => new Error('Error')));

      component.taskForm.patchValue({
        name: 'New Task',
        duration: 2,
        done: false
      });

      component.createTask();

      expect(component.errorMessage).toBe('Erreur lors de la création de la tâche.');
      expect(component.successMessage).toBe('');
    });
  });

  describe('Edge Cases', () => {
    it('should accept decimal duration values', () => {
      component.taskForm.patchValue({
        name: 'Task with decimal duration',
        duration: 2.5
      });
      expect(component.taskForm.valid).toBeTruthy();
    });

    it('should handle done checkbox correctly', () => {
      component.taskForm.patchValue({
        name: 'Completed Task',
        duration: 1,
        done: true
      });
      expect(component.taskForm.get('done')?.value).toBe(true);
      expect(component.taskForm.valid).toBeTruthy();
    });

    it('should include projectId in task data', () => {
      mockProjectService.createTask.and.returnValue(of({} as Task));
      
      component.projectId = 42;
      component.taskForm.patchValue({
        name: 'Task with projectId',
        duration: 3
      });

      component.createTask();

      const taskData = mockProjectService.createTask.calls.argsFor(0)[1];
      expect(taskData.projectId).toBe(42);
    });
  });
});
