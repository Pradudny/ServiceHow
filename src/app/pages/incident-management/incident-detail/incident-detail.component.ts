import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Incident, CreateIncidentRequest } from '../../../models/incident.model';
import { IncidentService } from '../../../services/incident.service';
import { CreateIncidentModalComponent } from '../create-incident-modal/create-incident-modal.component';

@Component({
  selector: 'app-incident-detail',
  standalone: true,
  imports: [CommonModule, CreateIncidentModalComponent],
  templateUrl: './incident-detail.component.html',
  styleUrl: './incident-detail.component.scss'
})
export class IncidentDetailComponent implements OnInit {
  incident: Incident | undefined;
  showEditModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private incidentService: IncidentService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadIncident(id);
  }

  loadIncident(id: number): void {
    this.incidentService.getIncidentById(id).subscribe({
      next: (data) => this.incident = data,
      error: (err) => console.error('Failed to load incident:', err)
    });
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
