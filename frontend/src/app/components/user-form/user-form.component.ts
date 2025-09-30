import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User, UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class UserFormComponent {
  user: User = { username: '', email: '', password: '' };

  @Output() saved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor(private userService: UserService) {}

  save() {
    this.userService.createUser(this.user).subscribe(() => this.saved.emit());
  }

  close() {
    this.cancel.emit();
  }
}
