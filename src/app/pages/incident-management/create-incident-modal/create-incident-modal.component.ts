import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Incident, CreateIncidentRequest } from '../../../models/incident.model';
import { UserDTO } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-create-incident-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-incident-modal.component.html',
  styleUrl: './create-incident-modal.component.scss'
})
export class CreateIncidentModalComponent implements OnInit {
  @Input() incident: Incident | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateIncidentRequest>();

  users: UserDTO[] = [];

  form = {
    title: '',
    description: '',
    slaDate: '',
    assignedTo:0,
    status: 'OPEN' as Incident['status'],
    priority: 'MEDIUM',
    assignmentGroup: ''
  };

  constructor(private userService: UserService) {}

  get isEditMode(): boolean {
    return this.incident !== null;
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (users) => this.users = users,
      error: (err) => console.error('Failed to load users:', err)
    });

    if (this.incident) {
      this.form = {
        title: this.incident.title,
        description: this.incident.description,
        slaDate: this.incident.slaDate,
        assignedTo: this.incident.assignedToId,
        status: this.incident.status,
        priority: this.incident.priority || 'MEDIUM',
        assignmentGroup: this.incident.assignmentGroup || ''
      };
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }

  onCancel(): void {
    this.close.emit();
  }

  onSave(): void {
    if (!this.form.title.trim() || !this.form.slaDate || !this.form.assignedTo) {
      return;
    }
    const now = new Date().toISOString();
    const createdDate = this.incident ? this.incident.createdDate : now;

    const request: CreateIncidentRequest = {
      title: this.form.title.trim(),
      description: this.form.description.trim(),
      createdBy: this.incident ? this.incident.createdBy : '',
      createdDate,
      modifiedBy: '',
      modifiedDate: now,
      status: this.form.status,
      priority: this.form.priority,
      assignmentGroup: this.form.assignmentGroup.trim(),
      slaDate: this.form.slaDate,
      assignedTo: this.form.assignedTo
    };

    this.save.emit(request);
  }
}
