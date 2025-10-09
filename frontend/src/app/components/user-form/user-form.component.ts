import { Component, EventEmitter, Output, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;

  @Output() saved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  private userService = inject(UserService);
  private fb = inject(FormBuilder);

  ngOnInit() {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get username() {
    return this.userForm.get('username');
  }

  get email() {
    return this.userForm.get('email');
  }

  get password() {
    return this.userForm.get('password');
  }

  save() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const userData: User = this.userForm.value;
    this.userService.createUser(userData).subscribe(() => this.saved.emit());
  }

  close() {
    this.cancel.emit();
  }
}
