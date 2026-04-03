import { UserDTO } from './user.model';

export interface Task {
  taskId: number;
  incidentId: number;
  taskName: string;
  taskDesc: string;
  assignedTo: UserDTO;
  status: string;
  createdBy: string;
  modifiedBy: string;
  createdDate: string;
  modifiedDate: string;
}

export interface CreateTaskRequest {
  taskName: string;
  taskDesc: string;
  assignedTo: number;
  status: string;
  createdBy: string;
  modifiedBy: string;
  createdDate: string;
  modifiedDate: string;
}
