import type {
  PaginatedResponse,
  QueryParams,
  Objective,
  ObjectiveCreate,
  KeyResult,
  KeyResultCreate,
  Kpi,
  KpiCreate,
  User,
  UserCreate,
  Role,
  RoleCreate,
  Group,
  GroupCreate,
  Organization,
  OrganizationCreate,
} from "../types";

const API_BASE_URL = "http://127.0.0.1:8000";

function buildQueryString(params: QueryParams): string {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.pageSize) searchParams.set("page_size", params.pageSize.toString());
  if (params.ordering) searchParams.set("ordering", params.ordering);
  if (params.name) searchParams.set("name", params.name);
  if (params.description) searchParams.set("description", params.description);
  return searchParams.toString();
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// Generic CRUD factory
function createCrudApi<T, TCreate>(basePath: string) {
  return {
    list: (params: QueryParams = {}): Promise<PaginatedResponse<T>> => {
      const query = buildQueryString(params);
      return request<PaginatedResponse<T>>(`${basePath}/?${query}`);
    },
    get: (id: number): Promise<T> => {
      return request<T>(`${basePath}/${id}/`);
    },
    create: (data: TCreate): Promise<T> => {
      return request<T>(`${basePath}/`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    update: (id: number, data: Partial<TCreate>): Promise<T> => {
      return request<T>(`${basePath}/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    delete: (id: number): Promise<void> => {
      return request<void>(`${basePath}/${id}/`, {
        method: "DELETE",
      });
    },
  };
}

export const api = {
  objectives: createCrudApi<Objective, ObjectiveCreate>("/objectives"),
  keyresults: createCrudApi<KeyResult, KeyResultCreate>("/keyresults"),
  kpis: createCrudApi<Kpi, KpiCreate>("/kpis"),
  users: createCrudApi<User, UserCreate>("/users"),
  roles: createCrudApi<Role, RoleCreate>("/roles"),
  groups: createCrudApi<Group, GroupCreate>("/groups"),
  organizations: createCrudApi<Organization, OrganizationCreate>("/organizations"),
};
