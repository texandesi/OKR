import type {
  PaginatedResponse,
  QueryParams,
  Objective,
  ObjectiveCreate,
  KeyResult,
  KeyResultCreate,
  KeyResultUpdate,
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
  MembershipResponse,
  OrganizationMembersResponse,
  GroupMembersResponse,
  UserMembershipsResponse,
  OwnershipCreate,
  OwnershipResponse,
  UserAssignedOKRs,
  EmojiType,
  ReactionResponse,
  KeyResultReactions,
  GroupStreakResponse,
  StreakCheckResponse,
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

// Membership API
const membershipApi = {
  // User-Organization
  addUserToOrganization: (
    organizationId: number,
    userId: number
  ): Promise<MembershipResponse> =>
    request(`/memberships/organizations/${organizationId}/users/${userId}`, {
      method: "POST",
    }),
  removeUserFromOrganization: (
    organizationId: number,
    userId: number
  ): Promise<MembershipResponse> =>
    request(`/memberships/organizations/${organizationId}/users/${userId}`, {
      method: "DELETE",
    }),
  getOrganizationMembers: (
    organizationId: number
  ): Promise<OrganizationMembersResponse> =>
    request(`/memberships/organizations/${organizationId}/members`),

  // Group-Organization
  addGroupToOrganization: (
    organizationId: number,
    groupId: number
  ): Promise<MembershipResponse> =>
    request(`/memberships/organizations/${organizationId}/groups/${groupId}`, {
      method: "POST",
    }),
  removeGroupFromOrganization: (
    organizationId: number,
    groupId: number
  ): Promise<MembershipResponse> =>
    request(`/memberships/organizations/${organizationId}/groups/${groupId}`, {
      method: "DELETE",
    }),

  // User-Group
  addUserToGroup: (groupId: number, userId: number): Promise<MembershipResponse> =>
    request(`/memberships/groups/${groupId}/users/${userId}`, {
      method: "POST",
    }),
  removeUserFromGroup: (
    groupId: number,
    userId: number
  ): Promise<MembershipResponse> =>
    request(`/memberships/groups/${groupId}/users/${userId}`, {
      method: "DELETE",
    }),
  getGroupMembers: (groupId: number): Promise<GroupMembersResponse> =>
    request(`/memberships/groups/${groupId}/members`),

  // User-Role
  addRoleToUser: (userId: number, roleId: number): Promise<MembershipResponse> =>
    request(`/memberships/users/${userId}/roles/${roleId}`, {
      method: "POST",
    }),
  removeRoleFromUser: (
    userId: number,
    roleId: number
  ): Promise<MembershipResponse> =>
    request(`/memberships/users/${userId}/roles/${roleId}`, {
      method: "DELETE",
    }),
  getUserMemberships: (userId: number): Promise<UserMembershipsResponse> =>
    request(`/memberships/users/${userId}/memberships`),

  // Group-Role
  addRoleToGroup: (groupId: number, roleId: number): Promise<MembershipResponse> =>
    request(`/memberships/groups/${groupId}/roles/${roleId}`, {
      method: "POST",
    }),
  removeRoleFromGroup: (
    groupId: number,
    roleId: number
  ): Promise<MembershipResponse> =>
    request(`/memberships/groups/${groupId}/roles/${roleId}`, {
      method: "DELETE",
    }),
};

// Streaks API
const streaksApi = {
  get: (groupId: number): Promise<GroupStreakResponse> =>
    request(`/groups/${groupId}/streak`),
  check: (groupId: number): Promise<StreakCheckResponse> =>
    request(`/groups/${groupId}/streak/check`, { method: "POST" }),
};

// Reactions API
const reactionsApi = {
  toggle: (
    keyResultId: number,
    emoji: EmojiType
  ): Promise<ReactionResponse | null> =>
    request(`/key-results/${keyResultId}/reactions`, {
      method: "POST",
      body: JSON.stringify({ emoji }),
    }),
  remove: (keyResultId: number, emoji: EmojiType): Promise<void> =>
    request(`/key-results/${keyResultId}/reactions/${emoji}`, {
      method: "DELETE",
    }),
  get: (keyResultId: number): Promise<KeyResultReactions> =>
    request(`/key-results/${keyResultId}/reactions`),
};

// Ownership API
const ownershipApi = {
  addOwner: (
    objectiveId: number,
    ownership: OwnershipCreate
  ): Promise<OwnershipResponse> =>
    request(`/ownership/objectives/${objectiveId}/owner`, {
      method: "POST",
      body: JSON.stringify(ownership),
    }),
  removeOwner: (
    objectiveId: number,
    ownerType: "user" | "role" | "group",
    ownerId: number
  ): Promise<{ message: string }> =>
    request(
      `/ownership/objectives/${objectiveId}/owner?ownerType=${ownerType}&ownerId=${ownerId}`,
      { method: "DELETE" }
    ),
  getOwners: (objectiveId: number): Promise<OwnershipResponse[]> =>
    request(`/ownership/objectives/${objectiveId}/owners`),
  getUserObjectives: (userId: number): Promise<UserAssignedOKRs> =>
    request(`/ownership/users/${userId}/objectives`),
};

// Key Results API with update support
const keyResultsApi = {
  ...createCrudApi<KeyResult, KeyResultCreate>("/keyresults"),
  update: (id: number, data: KeyResultUpdate): Promise<KeyResult> =>
    request<KeyResult>(`/keyresults/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

export const api = {
  objectives: createCrudApi<Objective, ObjectiveCreate>("/objectives"),
  keyresults: keyResultsApi,
  kpis: createCrudApi<Kpi, KpiCreate>("/kpis"),
  users: createCrudApi<User, UserCreate>("/users"),
  roles: createCrudApi<Role, RoleCreate>("/roles"),
  groups: createCrudApi<Group, GroupCreate>("/groups"),
  organizations: createCrudApi<Organization, OrganizationCreate>("/organizations"),
  memberships: membershipApi,
  ownership: ownershipApi,
  reactions: reactionsApi,
  streaks: streaksApi,
};
