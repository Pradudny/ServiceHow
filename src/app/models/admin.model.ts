export interface Feature {
  id: number;
  name: string;
  enabled: boolean;
}

export interface Role {
  id: number;
  name: string;
  features: Feature[];
  expanded?: boolean;
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

export { UserDTO as User } from './user.model';
