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
export type CelebrationTrigger = "hit_50" | "hit_75" | "hit_100" | null;

export interface Objective {
  id: number;
  name: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  isComplete: boolean;
  progressPercentage: number;
  celebrationTrigger: CelebrationTrigger;
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

// Lightweight reference types for nested relationships
export interface UserRef {
  id: number;
  name: string;
}

export interface RoleRef {
  id: number;
  name: string;
}

export interface GroupRef {
  id: number;
  name: string;
}

export interface OrganizationRef {
  id: number;
  name: string;
}

// Full entity types with relationships
export interface User {
  id: number;
  name: string;
  description: string;
  roles?: RoleRef[];
  groups?: GroupRef[];
  organizations?: OrganizationRef[];
}

export interface UserCreate {
  name: string;
  description: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  users?: UserRef[];
  groups?: GroupRef[];
}

export interface RoleCreate {
  name: string;
  description: string;
}

export interface Group {
  id: number;
  name: string;
  description: string;
  parentId?: number | null;
  ownerId?: number | null;
  parent?: GroupRef | null;
  owner?: UserRef | null;
  children?: GroupRef[];
  delegates?: UserRef[];
  users?: UserRef[];
  roles?: RoleRef[];
  organizations?: OrganizationRef[];
}

export interface GroupCreate {
  name: string;
  description: string;
  parentId?: number | null;
  ownerId?: number | null;
}

export interface Organization {
  id: number;
  name: string;
  description: string;
  users?: UserRef[];
  groups?: GroupRef[];
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

// Streak types
export interface GroupStreakResponse {
  id: number;
  groupId: number;
  groupName: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  streakStartedAt: string | null;
  isActiveToday: boolean;
}

export interface StreakCheckResponse {
  groupId: number;
  currentStreak: number;
  streakIncreased: boolean;
  message: string;
}

// Recurring schedule types
export type Frequency = "daily" | "weekly" | "monthly";

export interface RecurringScheduleCreate {
  frequency: Frequency;
  rotationEnabled?: boolean;
  rotationUsers?: number[];
  nextDueDate: string;
}

export interface RecurringScheduleUpdate {
  frequency?: Frequency;
  rotationEnabled?: boolean;
  rotationUsers?: number[];
  nextDueDate?: string;
}

export interface RecurringScheduleResponse {
  id: number;
  keyResultId: number;
  keyResultName: string;
  frequency: Frequency;
  rotationEnabled: boolean;
  rotationUsers: number[] | null;
  currentRotationIndex: number;
  nextDueDate: string;
  lastGeneratedAt: string | null;
  currentAssigneeId: number | null;
}

export interface DueTodayItem {
  keyResultId: number;
  keyResultName: string;
  objectiveName: string;
  frequency: Frequency;
  assigneeId: number | null;
  assigneeName: string | null;
}

export interface RegenerateResponse {
  regeneratedCount: number;
  rotatedCount: number;
  message: string;
}
