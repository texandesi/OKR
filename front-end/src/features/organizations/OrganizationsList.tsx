import { GenericEntityList } from "@/features/GenericEntityList";
import { organizationsHooks } from "@/hooks/useApi";

export function OrganizationsList() {
  return (
    <GenericEntityList
      title="Organizations"
      useList={organizationsHooks.useList}
      useCreate={organizationsHooks.useCreate}
      useUpdate={organizationsHooks.useUpdate}
      useDelete={organizationsHooks.useDelete}
    />
  );
}
