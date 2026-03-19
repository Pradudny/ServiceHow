import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Incident } from '../../../models/incident.model';
import { IncidentService } from '../../../services/incident.service';
import { CreateIncidentModalComponent } from '../create-incident-modal/create-incident-modal.component';

@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [CommonModule, CreateIncidentModalComponent],
  templateUrl: './incident-list.component.html',
  styleUrl: './incident-list.component.scss'
})
export class IncidentListComponent implements OnInit {
  incidents: Incident[] = [];
  showModal = false;
  editingIncident: Incident | null = null;

  constructor(
    private incidentService: IncidentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.incidents = this.incidentService.getIncidents();
  }

  viewIncident(id: number): void {
    this.router.navigate(['/incident-management', id]);
  }

  createIncident(): void {
    this.editingIncident = null;
    this.showModal = true;
  }

  editIncident(event: MouseEvent, incident: Incident): void {
    event.stopPropagation();
    this.editingIncident = incident;
    this.showModal = true;
  }

  onModalClose(): void {
    this.showModal = false;
    this.editingIncident = null;
  }

  onModalSave(data: Omit<Incident, 'id'>): void {
    if (this.editingIncident) {
      this.incidentService.updateIncident(this.editingIncident.id, data);
    } else {
      this.incidentService.addIncident(data);
    }
    this.incidents = this.incidentService.getIncidents();
    this.showModal = false;
    this.editingIncident = null;
  }

  getStatusClass(status: string): string {
    return 'status-' + status.toLowerCase().replace(/\s+/g, '-');
  }
}
