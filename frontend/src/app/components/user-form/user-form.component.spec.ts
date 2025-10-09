import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UserFormComponent } from './user-form.component';
import { UserService, User } from '../../services/user.service';
import { of, throwError } from 'rxjs';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['createUser']);

    await TestBed.configureTestingModule({
      imports: [UserFormComponent, ReactiveFormsModule],
      providers: [
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.userForm).toBeDefined();
    expect(component.userForm.get('username')?.value).toBe('');
    expect(component.userForm.get('email')?.value).toBe('');
    expect(component.userForm.get('password')?.value).toBe('');
  });

  describe('Form Validations', () => {
    it('should invalidate form when username is empty', () => {
      component.userForm.patchValue({ username: '' });
      expect(component.username?.hasError('required')).toBeTruthy();
      expect(component.userForm.invalid).toBeTruthy();
    });

    it('should invalidate form when username is too short', () => {
      component.userForm.patchValue({ username: 'AB' });
      expect(component.username?.hasError('minlength')).toBeTruthy();
      expect(component.userForm.invalid).toBeTruthy();
    });

    it('should validate form when username is valid', () => {
      component.userForm.patchValue({ username: 'validuser' });
      expect(component.username?.hasError('minlength')).toBeFalsy();
      expect(component.username?.hasError('required')).toBeFalsy();
    });

    it('should invalidate form when email is empty', () => {
      component.userForm.patchValue({ 
        username: 'validuser',
        email: '' 
      });
      expect(component.email?.hasError('required')).toBeTruthy();
      expect(component.userForm.invalid).toBeTruthy();
    });

    it('should invalidate form when email format is invalid', () => {
      component.userForm.patchValue({ 
        username: 'validuser',
        email: 'invalidemail' 
      });
      expect(component.email?.hasError('email')).toBeTruthy();
      expect(component.userForm.invalid).toBeTruthy();
    });

    it('should validate form when email format is valid', () => {
      component.userForm.patchValue({ 
        username: 'validuser',
        email: 'valid@example.com' 
      });
      expect(component.email?.hasError('email')).toBeFalsy();
      expect(component.email?.hasError('required')).toBeFalsy();
    });

    it('should invalidate form when password is empty', () => {
      component.userForm.patchValue({ 
        username: 'validuser',
        email: 'valid@example.com',
        password: '' 
      });
      expect(component.password?.hasError('required')).toBeTruthy();
      expect(component.userForm.invalid).toBeTruthy();
    });

    it('should invalidate form when password is too short', () => {
      component.userForm.patchValue({ 
        username: 'validuser',
        email: 'valid@example.com',
        password: '12345' 
      });
      expect(component.password?.hasError('minlength')).toBeTruthy();
      expect(component.userForm.invalid).toBeTruthy();
    });

    it('should validate form when password is valid', () => {
      component.userForm.patchValue({ 
        username: 'validuser',
        email: 'valid@example.com',
        password: '123456' 
      });
      expect(component.password?.hasError('minlength')).toBeFalsy();
      expect(component.password?.hasError('required')).toBeFalsy();
    });

    it('should validate form when all fields are filled correctly', () => {
      component.userForm.patchValue({
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'securepassword'
      });
      expect(component.userForm.valid).toBeTruthy();
    });
  });

  describe('Form Getters', () => {
    it('should return username form control', () => {
      expect(component.username).toBe(component.userForm.get('username'));
    });

    it('should return email form control', () => {
      expect(component.email).toBe(component.userForm.get('email'));
    });

    it('should return password form control', () => {
      expect(component.password).toBe(component.userForm.get('password'));
    });
  });

  describe('save', () => {
    it('should not submit when form is invalid', () => {
      component.userForm.patchValue({ username: '' });
      component.save();
      expect(mockUserService.createUser).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched when form is invalid', () => {
      component.userForm.patchValue({ username: '' });
      component.save();
      expect(component.userForm.get('username')?.touched).toBeTruthy();
      expect(component.userForm.get('email')?.touched).toBeTruthy();
      expect(component.userForm.get('password')?.touched).toBeTruthy();
    });

    it('should call createUser with correct data when form is valid', () => {
      const mockUser: User = { username: 'testuser', email: 'test@example.com', password: 'password123' };
      mockUserService.createUser.and.returnValue(of(mockUser));
      
      component.userForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      component.save();

      expect(mockUserService.createUser).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    });

    it('should emit saved event on successful creation', () => {
      const mockUser: User = { username: 'testuser', email: 'test@example.com', password: 'password123' };
      mockUserService.createUser.and.returnValue(of(mockUser));
      spyOn(component.saved, 'emit');

      component.userForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      component.save();

      expect(component.saved.emit).toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('should emit cancel event', () => {
      spyOn(component.cancel, 'emit');
      component.close();
      expect(component.cancel.emit).toHaveBeenCalled();
    });
  });

  describe('Email Validation Edge Cases', () => {
    it('should accept valid email with subdomain', () => {
      component.userForm.patchValue({
        username: 'testuser',
        email: 'user@mail.example.com',
        password: 'password123'
      });
      expect(component.email?.hasError('email')).toBeFalsy();
    });

    it('should accept valid email with plus sign', () => {
      component.userForm.patchValue({
        username: 'testuser',
        email: 'user+test@example.com',
        password: 'password123'
      });
      expect(component.email?.hasError('email')).toBeFalsy();
    });

    it('should reject email without @', () => {
      component.userForm.patchValue({
        username: 'testuser',
        email: 'userexample.com',
        password: 'password123'
      });
      expect(component.email?.hasError('email')).toBeTruthy();
    });

    it('should reject email without domain', () => {
      component.userForm.patchValue({
        username: 'testuser',
        email: 'user@',
        password: 'password123'
      });
      expect(component.email?.hasError('email')).toBeTruthy();
    });
  });

  describe('Password Validation Edge Cases', () => {
    it('should accept password with exactly 6 characters', () => {
      component.userForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        password: '123456'
      });
      expect(component.password?.hasError('minlength')).toBeFalsy();
    });

    it('should accept password with special characters', () => {
      component.userForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        password: 'P@ssw0rd!'
      });
      expect(component.userForm.valid).toBeTruthy();
    });

    it('should accept long password', () => {
      component.userForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        password: 'VeryLongPasswordWith123Numbers'
      });
      expect(component.userForm.valid).toBeTruthy();
    });
  });

  describe('Username Validation Edge Cases', () => {
    it('should accept username with exactly 3 characters', () => {
      component.userForm.patchValue({
        username: 'abc',
        email: 'test@example.com',
        password: 'password123'
      });
      expect(component.username?.hasError('minlength')).toBeFalsy();
    });

    it('should accept username with numbers', () => {
      component.userForm.patchValue({
        username: 'user123',
        email: 'test@example.com',
        password: 'password123'
      });
      expect(component.userForm.valid).toBeTruthy();
    });

    it('should accept username with special characters', () => {
      component.userForm.patchValue({
        username: 'user_name',
        email: 'test@example.com',
        password: 'password123'
      });
      expect(component.userForm.valid).toBeTruthy();
    });
  });
});
