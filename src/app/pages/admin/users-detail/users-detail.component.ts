import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDTO } from '../../../models/user.model';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-users-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-detail.component.html',
  styleUrl: './users-detail.component.scss'
})
export class UsersDetailComponent implements OnInit {
  users: UserDTO[] = [];
  allRoles: string[] = [];

  showModal = false;
  editingUser: UserDTO | null = null;
  userForm = {
    userFname: '',
    userLname: '',
    department: '',
    urole: '',
    birthDate: '',
    address: '',
    email: '',
    phoneNumber: 0,
    createdBy: ''
  };

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.allRoles = this.adminService.getAllRoleNames();
  }

  loadUsers(): void {
    this.adminService.getUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Failed to load users:', err)
    });
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }

  openAddUser(): void {
    this.editingUser = null;
    this.userForm = {
      userFname: '', userLname: '', department: '', urole: '',
      birthDate: '', address: '', email: '', phoneNumber: 0, createdBy: ''
    };
    this.showModal = true;
  }

  openEditUser(user: UserDTO): void {
    this.editingUser = user;
    this.userForm = {
      userFname: user.userFname,
      userLname: user.userLname,
      department: user.department,
      urole: user.urole,
      birthDate: user.birthDate,
      address: user.address,
      email: user.email,
      phoneNumber: user.phoneNumber,
      createdBy: user.createdBy
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingUser = null;
  }

  saveUser(): void {
    if (!this.userForm.userFname.trim() || !this.userForm.email.trim()) return;
    const payload = { ...this.userForm };
    if (this.editingUser) {
      this.adminService.updateUser(this.editingUser.userId, payload).subscribe({
        next: () => { this.loadUsers(); this.closeModal(); },
        error: (err) => console.error('Failed to update user:', err)
      });
    } else {
      this.adminService.addUser(payload).subscribe({
        next: () => { this.loadUsers(); this.closeModal(); },
        error: (err) => console.error('Failed to add user:', err)
      });
    }
  }

  deleteUser(event: MouseEvent, user: UserDTO): void {
    event.stopPropagation();
    this.adminService.deleteUser(user.userId).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Failed to delete user:', err)
    });
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }
}
