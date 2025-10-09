import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ProjectFormComponent } from './project-form.component';
import { ProjectService } from '../../services/project.service';
import { of, throwError } from 'rxjs';
import { Project } from '../../models/project.model';

describe('ProjectFormComponent', () => {
  let component: ProjectFormComponent;
  let fixture: ComponentFixture<ProjectFormComponent>;
  let mockProjectService: jasmine.SpyObj<ProjectService>;

  beforeEach(async () => {
    mockProjectService = jasmine.createSpyObj('ProjectService', ['createProject', 'updateProject']);

    await TestBed.configureTestingModule({
      imports: [ProjectFormComponent, ReactiveFormsModule],
      providers: [
        { provide: ProjectService, useValue: mockProjectService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.projectForm).toBeDefined();
    expect(component.projectForm.get('name')?.value).toBe('');
    expect(component.projectForm.get('description')?.value).toBe('');
    expect(component.projectForm.get('startDate')?.value).toBe('');
    expect(component.projectForm.get('endDate')?.value).toBe('');
  });

  describe('Form Validations', () => {
    it('should invalidate form when name is empty', () => {
      component.projectForm.patchValue({ name: '' });
      expect(component.name?.hasError('required')).toBeTruthy();
      expect(component.projectForm.invalid).toBeTruthy();
    });

    it('should invalidate form when name is too short', () => {
      component.projectForm.patchValue({ name: 'AB' });
      expect(component.name?.hasError('minlength')).toBeTruthy();
      expect(component.projectForm.invalid).toBeTruthy();
    });

    it('should validate form when name is valid', () => {
      component.projectForm.patchValue({ name: 'Valid Project Name' });
      expect(component.name?.hasError('minlength')).toBeFalsy();
      expect(component.name?.hasError('required')).toBeFalsy();
    });

    it('should invalidate form when startDate is empty', () => {
      component.projectForm.patchValue({ 
        name: 'Valid Name',
        startDate: '' 
      });
      expect(component.startDate?.hasError('required')).toBeTruthy();
      expect(component.projectForm.invalid).toBeTruthy();
    });

    it('should invalidate form when endDate is empty', () => {
      component.projectForm.patchValue({ 
        name: 'Valid Name',
        startDate: '2025-01-01',
        endDate: '' 
      });
      expect(component.endDate?.hasError('required')).toBeTruthy();
      expect(component.projectForm.invalid).toBeTruthy();
    });

    it('should validate form when all required fields are filled correctly', () => {
      component.projectForm.patchValue({
        name: 'Valid Project',
        description: 'Test description',
        startDate: '2025-01-01',
        endDate: '2025-12-31'
      });
      expect(component.projectForm.valid).toBeTruthy();
    });
  });

  describe('Form Getters', () => {
    it('should return name form control', () => {
      expect(component.name).toBe(component.projectForm.get('name'));
    });

    it('should return startDate form control', () => {
      expect(component.startDate).toBe(component.projectForm.get('startDate'));
    });

    it('should return endDate form control', () => {
      expect(component.endDate).toBe(component.projectForm.get('endDate'));
    });
  });

  describe('isEditMode', () => {
    it('should return false when projectToEdit is null', () => {
      component.projectToEdit = null;
      expect(component.isEditMode).toBeFalsy();
    });

    it('should return false when projectToEdit has no id', () => {
      component.projectToEdit = { name: 'Test', description: '', startDate: '', endDate: '' };
      expect(component.isEditMode).toBeFalsy();
    });

    it('should return true when projectToEdit has an id', () => {
      component.projectToEdit = { id: 1, name: 'Test', description: '', startDate: '', endDate: '' };
      expect(component.isEditMode).toBeTruthy();
    });
  });

  describe('saveProject - Create Mode', () => {
    beforeEach(() => {
      component.projectToEdit = null;
    });

    it('should not submit when form is invalid', () => {
      component.projectForm.patchValue({ name: '' });
      component.saveProject();
      expect(mockProjectService.createProject).not.toHaveBeenCalled();
    });

    it('should call createProject when form is valid', () => {
      mockProjectService.createProject.and.returnValue(of({} as Project));
      
      component.projectForm.patchValue({
        name: 'New Project',
        description: 'Description',
        startDate: '2025-01-01',
        endDate: '2025-12-31'
      });

      component.saveProject();

      expect(mockProjectService.createProject).toHaveBeenCalledWith({
        name: 'New Project',
        description: 'Description',
        startDate: '2025-01-01',
        endDate: '2025-12-31'
      });
    });

    it('should display success message on successful creation', () => {
      mockProjectService.createProject.and.returnValue(of({} as Project));
      
      component.projectForm.patchValue({
        name: 'New Project',
        description: 'Description',
        startDate: '2025-01-01',
        endDate: '2025-12-31'
      });

      component.saveProject();

      expect(component.successMessage).toBe('Projet créé avec succès !');
      expect(component.errorMessage).toBe('');
    });

    it('should emit projectSaved event on successful creation', () => {
      mockProjectService.createProject.and.returnValue(of({} as Project));
      spyOn(component.projectSaved, 'emit');

      component.projectForm.patchValue({
        name: 'New Project',
        description: 'Description',
        startDate: '2025-01-01',
        endDate: '2025-12-31'
      });

      component.saveProject();

      expect(component.projectSaved.emit).toHaveBeenCalled();
    });

    it('should reset form on successful creation', () => {
      mockProjectService.createProject.and.returnValue(of({} as Project));

      component.projectForm.patchValue({
        name: 'New Project',
        description: 'Description',
        startDate: '2025-01-01',
        endDate: '2025-12-31'
      });

      component.saveProject();

      expect(component.projectForm.get('name')?.value).toBeNull();
    });

    it('should display error message on creation failure', () => {
      mockProjectService.createProject.and.returnValue(throwError(() => new Error('Error')));

      component.projectForm.patchValue({
        name: 'New Project',
        description: 'Description',
        startDate: '2025-01-01',
        endDate: '2025-12-31'
      });

      component.saveProject();

      expect(component.errorMessage).toBe('Erreur lors de la création du projet.');
      expect(component.successMessage).toBe('');
    });
  });

  describe('saveProject - Edit Mode', () => {
    beforeEach(() => {
      component.projectToEdit = { 
        id: 1, 
        name: 'Existing Project', 
        description: 'Old description',
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      };
      component.ngOnInit();
    });

    it('should call updateProject when form is valid in edit mode', () => {
      mockProjectService.updateProject.and.returnValue(of({} as Project));

      component.projectForm.patchValue({
        name: 'Updated Project',
        description: 'Updated description',
        startDate: '2025-01-01',
        endDate: '2025-12-31'
      });

      component.saveProject();

      expect(mockProjectService.updateProject).toHaveBeenCalledWith(1, {
        id: 1,
        name: 'Updated Project',
        description: 'Updated description',
        startDate: '2025-01-01',
        endDate: '2025-12-31'
      });
    });

    it('should display success message on successful update', () => {
      mockProjectService.updateProject.and.returnValue(of({} as Project));

      component.projectForm.patchValue({
        name: 'Updated Project',
        description: 'Updated description',
        startDate: '2025-01-01',
        endDate: '2025-12-31'
      });

      component.saveProject();

      expect(component.successMessage).toBe('Projet modifié avec succès !');
      expect(component.errorMessage).toBe('');
    });

    it('should display error message on update failure', () => {
      mockProjectService.updateProject.and.returnValue(throwError(() => new Error('Error')));

      component.projectForm.patchValue({
        name: 'Updated Project',
        description: 'Updated description',
        startDate: '2025-01-01',
        endDate: '2025-12-31'
      });

      component.saveProject();

      expect(component.errorMessage).toBe('Erreur lors de la modification du projet.');
      expect(component.successMessage).toBe('');
    });
  });

  describe('ngOnChanges', () => {
    it('should reinitialize form when projectToEdit changes', () => {
      const newProject: Project = {
        id: 2,
        name: 'Changed Project',
        description: 'Changed description',
        startDate: '2025-06-01',
        endDate: '2025-12-31'
      };

      component.projectToEdit = newProject;
      component.ngOnChanges({
        projectToEdit: {
          currentValue: newProject,
          previousValue: null,
          firstChange: false,
          isFirstChange: () => false
        }
      });

      expect(component.projectForm.get('name')?.value).toBe('Changed Project');
      expect(component.projectForm.get('description')?.value).toBe('Changed description');
      expect(component.projectForm.get('startDate')?.value).toBe('2025-06-01');
      expect(component.projectForm.get('endDate')?.value).toBe('2025-12-31');
    });
  });
});
