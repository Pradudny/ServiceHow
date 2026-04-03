import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Incident, CreateIncidentRequest } from '../../../models/incident.model';
import { IncidentService } from '../../../services/incident.service';
import { CreateIncidentModalComponent } from '../create-incident-modal/create-incident-modal.component';
import { TaskService } from '../../../services/task.service';
import { Task, CreateTaskRequest } from '../../../models/task.model';
import { UserDTO } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-incident-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, CreateIncidentModalComponent],
  templateUrl: './incident-detail.component.html',
  styleUrl: './incident-detail.component.scss'
})
export class IncidentDetailComponent implements OnInit {
  incident: Incident | undefined;
  tasks: Task[] = [];
  users: UserDTO[] = [];
  showEditModal = false;
  showTaskForm = false;
  editingTask: Task | null = null;
  taskStatuses = ['NEW', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED'];

  taskForm = {
    taskName: '',
    taskDesc: '',
    assignedTo: 0,
    status: 'NEW'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private incidentService: IncidentService,
    private taskService: TaskService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadIncident(id);
    this.loadUsers();
  }

  loadIncident(id: number): void {
    this.incidentService.getIncidentById(id).subscribe({
      next: (data) => {
        this.incident = data;
        this.loadTasks(id);
      },
      error: (err) => console.error('Failed to load incident:', err)
    });
  }

  loadTasks(incidentId: number): void {
    this.taskService.getIncidentTasks(incidentId).subscribe({
      next: (data) => this.tasks = data,
      error: (err) => console.error('Failed to load tasks:', err)
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => this.users = users,
      error: (err) => console.error('Failed to load users:', err)
    });
  }

  openAddTask(): void {
    this.resetTaskForm();
    this.editingTask = null;
    this.showTaskForm = true;
  }

  editTask(task: Task): void {
    this.editingTask = task;
    this.taskForm = {
      taskName: task.taskName,
      taskDesc: task.taskDesc,
      assignedTo: task.assignedTo?.userId ?? 0,
      status: task.status || 'NEW'
    };
    this.showTaskForm = true;
  }

  cancelTaskForm(): void {
    this.showTaskForm = false;
    this.resetTaskForm();
  }

  saveTask(): void {
    if (!this.incident || !this.taskForm.taskName.trim() || !this.taskForm.assignedTo) {
      return;
    }

    const now = new Date().toISOString();
    const payload: CreateTaskRequest = {
      taskName: this.taskForm.taskName.trim(),
      taskDesc: this.taskForm.taskDesc.trim(),
      assignedTo: this.taskForm.assignedTo,
      status: this.taskForm.status,
      createdBy: this.editingTask ? this.editingTask.createdBy : this.incident.createdBy,
      createdDate: this.editingTask ? this.editingTask.createdDate : now,
      modifiedBy: this.incident.modifiedBy || this.incident.createdBy,
      modifiedDate: now
    };

    if (this.editingTask) {
      this.taskService.updateTask(this.incident.incidentId, this.editingTask.taskId, payload).subscribe({
        next: () => {
          this.loadTasks(this.incident!.incidentId);
          this.cancelTaskForm();
        },
        error: (err) => console.error('Failed to update task:', err)
      });
    } else {
      this.taskService.addTask(this.incident.incidentId, payload).subscribe({
        next: () => {
          this.loadTasks(this.incident!.incidentId);
          this.cancelTaskForm();
        },
        error: (err) => console.error('Failed to add task:', err)
      });
    }
  }

  deleteTask(taskId: number): void {
    if (!this.incident) {
      return;
    }
    this.taskService.deleteTask(this.incident.incidentId, taskId).subscribe({
      next: () => this.loadTasks(this.incident!.incidentId),
      error: (err) => console.error('Failed to delete task:', err)
    });
  }

  resetTaskForm(): void {
    this.taskForm = {
      taskName: '',
      taskDesc: '',
      assignedTo: 0,
      status: 'NEW'
    };
  }

  editIncident(): void {
    this.showEditModal = true;
  }

  onModalClose(): void {
    this.showEditModal = false;
  }

  onModalSave(data: CreateIncidentRequest): void {
    if (this.incident) {
      this.incidentService.updateIncident(this.incident.incidentId, data).subscribe({
        next: () => {
          this.loadIncident(this.incident!.incidentId);
          this.showEditModal = false;
        },
        error: (err) => console.error('Failed to update incident:', err)
      });
    }
  }

  completeIncident(): void {
    if (this.incident) {
      const data: CreateIncidentRequest = {
        title: this.incident.title,
        description: this.incident.description,
        createdBy: this.incident.createdBy,
        createdDate: this.incident.createdDate,
        modifiedBy: this.incident.modifiedBy,
        modifiedDate: new Date().toISOString(),
        status: 'RESOLVED',
        priority: this.incident.priority,
        assignmentGroup: this.incident.assignmentGroup,
        slaDate: this.incident.slaDate,
        assignedTo: this.incident.assignedToId
      };
      this.incidentService.updateIncident(this.incident.incidentId, data).subscribe({
        next: () => this.loadIncident(this.incident!.incidentId),
        error: (err) => console.error('Failed to complete incident:', err)
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/incident-management']);
  }

  getStatusClass(status: string): string {
    return 'status-' + status.toLowerCase().replace(/[_\s]+/g, '-');
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'OPEN': 'Open',
      'IN_PROGRESS': 'In Progress',
      'ON_HOLD': 'On Hold',
      'RESOLVED': 'Resolved',
      'CLOSED': 'Closed'
    };
    return labels[status] || status;
  }
}
