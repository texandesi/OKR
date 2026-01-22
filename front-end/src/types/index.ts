// Paginated response (matches FastAPI format)
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Query params for list endpoints
export interface QueryParams {
  page?: number;
  pageSize?: number;
  ordering?: string;
  name?: string;
  description?: string;
}

// Core entities
export interface Objective {
  id: number;
  name: string;
  description: string;
  keyresults?: KeyResult[];
}

export interface ObjectiveCreate {
  name: string;
  description: string;
}

export interface KeyResult {
  id: number;
  name: string;
  description: string;
  objective: number;
  objectiveName?: string;
  targetValue: number | null;
  currentValue: number | null;
  unit: string | null;
  progressPercentage: number;
}

export interface KeyResultCreate {
  name: string;
  description: string;
  objective: number;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
}

export interface Kpi {
  id: number;
  name: string;
  description: string;
}

export interface KpiCreate {
  name: string;
  description: string;
}

export interface User {
  id: number;
  name: string;
  description: string;
}

export interface UserCreate {
  name: string;
  description: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface RoleCreate {
  name: string;
  description: string;
}

export interface Group {
  id: number;
  name: string;
  description: string;
}

export interface GroupCreate {
  name: string;
  description: string;
}

export interface Organization {
  id: number;
  name: string;
  description: string;
}

export interface OrganizationCreate {
  name: string;
  description: string;
}
