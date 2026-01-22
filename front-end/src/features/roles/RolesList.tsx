import { GenericEntityList } from "@/features/GenericEntityList";
import { rolesHooks } from "@/hooks/useApi";

export function RolesList() {
  return (
    <GenericEntityList
      title="Roles"
      useList={rolesHooks.useList}
      useCreate={rolesHooks.useCreate}
      useUpdate={rolesHooks.useUpdate}
      useDelete={rolesHooks.useDelete}
    />
  );
}
