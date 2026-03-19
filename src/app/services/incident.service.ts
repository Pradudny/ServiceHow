import { Injectable } from '@angular/core';
import { Incident } from '../models/incident.model';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private incidents: Incident[] = [
    {
      id: 1,
      title: 'Server outage in US-East region',
      description: 'Multiple servers in the US-East region are experiencing downtime. Users are unable to access the application. The issue was first reported at 09:15 AM and is affecting approximately 2,000 users.',
      createdDate: '2026-03-15',
      slaDate: '2026-03-16',
      status: 'Open',
      assignedTo: 'John Doe'
    },
    {
      id: 2,
      title: 'Database connection timeout',
      description: 'The primary database is intermittently timing out causing failed transactions. This is impacting the checkout flow for customers. Initial investigation points to a connection pool exhaustion issue.',
      createdDate: '2026-03-14',
      slaDate: '2026-03-17',
      status: 'In Progress',
      assignedTo: 'Jane Smith'
    },
    {
      id: 3,
      title: 'Email notification service failure',
      description: 'The email notification service has stopped sending transactional emails. Order confirmations and password reset emails are not being delivered. The SMTP relay appears to be rejecting connections.',
      createdDate: '2026-03-13',
      slaDate: '2026-03-15',
      status: 'Resolved',
      assignedTo: 'Mike Johnson'
    },
    {
      id: 4,
      title: 'SSL certificate expiry warning',
      description: 'The SSL certificate for the production domain is expiring in 7 days. Immediate renewal is required to prevent service disruption and browser security warnings for end users.',
      createdDate: '2026-03-12',
      slaDate: '2026-03-19',
      status: 'Open',
      assignedTo: 'Sarah Wilson'
    },
    {
      id: 5,
      title: 'Memory leak in payment service',
      description: 'The payment processing service is gradually consuming more memory over time, leading to degraded performance after 48 hours of uptime. A restart temporarily resolves the issue.',
      createdDate: '2026-03-10',
      slaDate: '2026-03-18',
      status: 'In Progress',
      assignedTo: 'Alex Brown'
    }
  ];

  getIncidents(): Incident[] {
    return this.incidents;
  }

  getIncidentById(id: number): Incident | undefined {
    return this.incidents.find(i => i.id === id);
  }

  addIncident(data: Omit<Incident, 'id'>): Incident {
    const newId = this.incidents.length > 0
      ? Math.max(...this.incidents.map(i => i.id)) + 1
      : 1;
    const incident: Incident = { id: newId, ...data };
    this.incidents.unshift(incident);
    return incident;
  }

  updateIncident(id: number, data: Partial<Omit<Incident, 'id'>>): void {
    const incident = this.incidents.find(i => i.id === id);
    if (incident) {
      Object.assign(incident, data);
    }
  }

  updateIncidentStatus(id: number, status: Incident['status']): void {
    const incident = this.incidents.find(i => i.id === id);
    if (incident) {
      incident.status = status;
    }
  }
}
