import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";
import type {
  QueryParams,
  PaginatedResponse,
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
} from "@/types";

// Type for API methods
interface ApiMethods<T, TCreate> {
  list: (params?: QueryParams) => Promise<PaginatedResponse<T>>;
  get: (id: number) => Promise<T>;
  create: (data: TCreate) => Promise<T>;
  update: (id: number, data: Partial<TCreate>) => Promise<T>;
  delete: (id: number) => Promise<void>;
}

// Generic hook factory for entities
function createEntityHooks<T, TCreate>(
  entityName: string,
  apiMethods: ApiMethods<T, TCreate>
) {
  const useList = (params: QueryParams = {}) => {
    return useQuery({
      queryKey: [entityName, params],
      queryFn: () => apiMethods.list(params),
    });
  };

  const useGet = (id: number) => {
    return useQuery({
      queryKey: [entityName, id],
      queryFn: () => apiMethods.get(id),
      enabled: !!id,
    });
  };

  const useCreate = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: TCreate) => apiMethods.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [entityName] });
      },
    });
  };

  const useUpdate = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<TCreate> }) =>
        apiMethods.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [entityName] });
      },
    });
  };

  const useDelete = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: number) => apiMethods.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [entityName] });
      },
    });
  };

  return { useList, useGet, useCreate, useUpdate, useDelete };
}

// Export hooks for each entity with proper types
export const objectivesHooks = createEntityHooks<Objective, ObjectiveCreate>(
  "objectives",
  api.objectives
);

export const keyresultsHooks = createEntityHooks<KeyResult, KeyResultCreate>(
  "keyresults",
  api.keyresults
);

export const kpisHooks = createEntityHooks<Kpi, KpiCreate>("kpis", api.kpis);

export const usersHooks = createEntityHooks<User, UserCreate>(
  "users",
  api.users
);

export const rolesHooks = createEntityHooks<Role, RoleCreate>(
  "roles",
  api.roles
);

export const groupsHooks = createEntityHooks<Group, GroupCreate>(
  "groups",
  api.groups
);

export const organizationsHooks = createEntityHooks<
  Organization,
  OrganizationCreate
>("organizations", api.organizations);
