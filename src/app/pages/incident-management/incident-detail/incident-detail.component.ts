import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Incident } from '../../../models/incident.model';
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
    this.incident = this.incidentService.getIncidentById(id);
  }

  editIncident(): void {
    this.showEditModal = true;
  }

  onModalClose(): void {
    this.showEditModal = false;
  }

  onModalSave(data: Omit<Incident, 'id'>): void {
    if (this.incident) {
      this.incidentService.updateIncident(this.incident.id, data);
      this.incident = this.incidentService.getIncidentById(this.incident.id);
    }
    this.showEditModal = false;
  }

  completeIncident(): void {
    if (this.incident) {
      this.incidentService.updateIncidentStatus(this.incident.id, 'Resolved');
      this.incident = this.incidentService.getIncidentById(this.incident.id);
    }
  }

  goBack(): void {
    this.router.navigate(['/incident-management']);
  }

  getStatusClass(status: string): string {
    return 'status-' + status.toLowerCase().replace(/\s+/g, '-');
  }
}
