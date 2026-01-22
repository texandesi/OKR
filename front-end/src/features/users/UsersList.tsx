import { GenericEntityList } from "@/features/GenericEntityList";
import { usersHooks } from "@/hooks/useApi";

export function UsersList() {
  return (
    <GenericEntityList
      title="Users"
      useList={usersHooks.useList}
      useCreate={usersHooks.useCreate}
      useUpdate={usersHooks.useUpdate}
      useDelete={usersHooks.useDelete}
    />
  );
}
