import { GenericEntityList } from "@/features/GenericEntityList";
import { kpisHooks } from "@/hooks/useApi";

export function KpisList() {
  return (
    <GenericEntityList
      title="KPIs"
      useList={kpisHooks.useList}
      useCreate={kpisHooks.useCreate}
      useUpdate={kpisHooks.useUpdate}
      useDelete={kpisHooks.useDelete}
    />
  );
}
