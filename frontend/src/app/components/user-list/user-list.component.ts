import { CommonModule } from '@angular/common';
import { Component, computed, inject, model, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User, UserService } from '../../services/user.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: true,
  imports: [CommonModule, UserFormComponent, SearchBarComponent]
})
export class UserListComponent implements OnInit {
  users = model<User[]>([]);   // tableau vide au départ

  search = model('');

  filteredUsers = computed(() => {
    return this.users().filter((user) => 
    user.username.includes(this.search()))
  });
  showForm = false;

  userService = inject(UserService);

  constructor() {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers()
      .pipe(takeUntilDestroyed())
      .subscribe(users => this.users.set(users));
  }

  onUserCreated() {
    this.showForm = false;
    this.loadUsers();
  }

  hihi() {
    console.log("hihi");
  }
}
