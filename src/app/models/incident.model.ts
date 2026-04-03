import { Task } from './task.model';

export interface Incident {
  incidentId: number;
  title: string;
  description: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'ON_HOLD' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assignmentGroup: string;
  slaDate: string;
  assignedTo: string;
  assignedToId: number;
  tasks?: Task[];
}

export interface CreateIncidentRequest {
  incidentId?: number;
  title: string;
  description: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  status: string;
  priority: string;
  assignmentGroup: string;
  slaDate: string;
  assignedTo: number;
}
