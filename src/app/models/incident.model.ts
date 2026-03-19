export interface Incident {
  id: number;
  title: string;
  description: string;
  createdDate: string;
  slaDate: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo: string;
}
