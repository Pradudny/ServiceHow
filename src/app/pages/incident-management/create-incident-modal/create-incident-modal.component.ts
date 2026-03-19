import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Incident } from '../../../models/incident.model';

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
  @Output() save = new EventEmitter<Omit<Incident, 'id'>>();

  form = {
    title: '',
    description: '',
    slaDate: '',
    assignedTo: '',
    status: 'Open' as Incident['status']
  };

  get isEditMode(): boolean {
    return this.incident !== null;
  }

  ngOnInit(): void {
    if (this.incident) {
      this.form = {
        title: this.incident.title,
        description: this.incident.description,
        slaDate: this.incident.slaDate,
        assignedTo: this.incident.assignedTo,
        status: this.incident.status
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
    if (!this.form.title.trim() || !this.form.slaDate || !this.form.assignedTo.trim()) {
      return;
    }
    const createdDate = this.incident
      ? this.incident.createdDate
      : new Date().toISOString().split('T')[0];
    this.save.emit({
      title: this.form.title.trim(),
      description: this.form.description.trim(),
      createdDate,
      slaDate: this.form.slaDate,
      assignedTo: this.form.assignedTo.trim(),
      status: this.form.status
    });
  }
}
