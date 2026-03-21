export interface Feature {
  id: number;
  name: string;
  enabled?: boolean;
}

export interface Role {
  id: number;
  name: string;
  features?: Feature[];
  expanded?: boolean;
}

export interface RolesFeaturesResponse {
  roles: Role[];
  features: Feature[];
}

export interface AuthorizeFeaturePayload {
  roleId: number;
  features: Array<{ featureId: number; enabled: boolean }>;
}

export interface Team {
  id: number;
  name: string;
  description: string;
}

export interface AppModule {
  id: string;
  name: string;
  teams: Team[];
  roles: Role[];
}

export interface ModuleDTO {
  moduleId: number;
  moduleName: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}

export interface TeamDTO {
  teamId: number;
  tName: string;
  tDesc: string;
  roleId: number;
  roleName: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  userIds: number[];
  userNames: string[];
}

export interface RoleFeatureState {
  [roleId: number]: { [featureId: number]: boolean };
}

export { UserDTO as User } from './user.model';
