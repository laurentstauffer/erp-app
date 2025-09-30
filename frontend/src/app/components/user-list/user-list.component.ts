import { CommonModule } from '@angular/common'; 
import { Component, OnInit } from '@angular/core';
import { User, UserService } from '../../services/user.service';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: true,
  imports: [CommonModule, UserFormComponent]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  showForm = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(users => this.users = users);
  }

  onUserCreated() {
    this.showForm = false;
    this.loadUsers();
  }
}
