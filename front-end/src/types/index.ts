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

// Objective ownership
export interface ObjectiveOwnership {
  id: number;
  ownerType: "user" | "role" | "group";
  ownerId: number;
  ownerName?: string;
}

// Core entities
export interface Objective {
  id: number;
  name: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  isComplete: boolean;
  progressPercentage: number;
  keyresults?: KeyResult[];
  ownerships?: ObjectiveOwnership[];
}

export interface ObjectiveCreate {
  name: string;
  description: string;
  startDate?: string | null;
  endDate?: string | null;
}

export interface ObjectiveUpdate {
  name?: string;
  description?: string;
  startDate?: string | null;
  endDate?: string | null;
  isComplete?: boolean;
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
  startDate: string | null;
  endDate: string | null;
  isComplete: boolean;
  effectiveStartDate: string | null;
  effectiveEndDate: string | null;
}

export interface KeyResultCreate {
  name: string;
  description: string;
  objective: number;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  startDate?: string | null;
  endDate?: string | null;
}

export interface KeyResultUpdate {
  name?: string;
  description?: string;
  objective?: number;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  startDate?: string | null;
  endDate?: string | null;
  isComplete?: boolean;
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

// Membership types
export interface MembershipResponse {
  success: boolean;
  message: string;
}

export interface UserInOrganization {
  id: number;
  name: string;
  description: string;
}

export interface GroupInOrganization {
  id: number;
  name: string;
  description: string;
}

export interface OrganizationMembersResponse {
  users: UserInOrganization[];
  groups: GroupInOrganization[];
}

export interface UserInGroup {
  id: number;
  name: string;
  description: string;
}

export interface RoleAssignment {
  id: number;
  name: string;
  description: string;
}

export interface GroupAssignment {
  id: number;
  name: string;
  description: string;
}

export interface GroupMembersResponse {
  users: UserInGroup[];
  roles: RoleAssignment[];
}

export interface UserMembershipsResponse {
  organizations: GroupInOrganization[];
  groups: GroupAssignment[];
  roles: RoleAssignment[];
}

// Ownership types
export interface OwnershipCreate {
  ownerType: "user" | "role" | "group";
  ownerId: number;
}

export interface OwnershipResponse {
  id: number;
  objectiveId: number;
  ownerType: "user" | "role" | "group";
  ownerId: number;
  ownerName?: string;
}

export interface UserAssignedOKRs {
  individual: Objective[];
  byRole: Record<string, Objective[]>;
  byGroup: Record<string, Objective[]>;
}

// Reaction types
export type EmojiType = "celebration" | "clap" | "fire" | "heart";

export interface ReactionCreate {
  emoji: EmojiType;
}

export interface ReactionResponse {
  id: number;
  keyResultId: number;
  userId: number;
  userName: string;
  emoji: EmojiType;
  createdAt: string;
}

export interface ReactionSummary {
  emoji: EmojiType;
  count: number;
  users: string[];
  userIds: number[];
}

export interface KeyResultReactions {
  keyResultId: number;
  reactions: ReactionSummary[];
  totalCount: number;
}
