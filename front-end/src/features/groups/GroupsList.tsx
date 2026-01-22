import { GenericEntityList } from "@/features/GenericEntityList";
import { groupsHooks } from "@/hooks/useApi";

export function GroupsList() {
  return (
    <GenericEntityList
      title="Groups"
      useList={groupsHooks.useList}
      useCreate={groupsHooks.useCreate}
      useUpdate={groupsHooks.useUpdate}
      useDelete={groupsHooks.useDelete}
    />
  );
}
