import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Dashboard } from "@/features/dashboard/Dashboard";
import { ObjectivesList } from "@/features/objectives/ObjectivesList";
import { KeyResultsList } from "@/features/keyresults/KeyResultsList";
import { KpisList } from "@/features/kpis/KpisList";
import { UsersList } from "@/features/users/UsersList";
import { RolesList } from "@/features/roles/RolesList";
import { GroupsList } from "@/features/groups/GroupsList";
import { OrganizationsList } from "@/features/organizations/OrganizationsList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="objectives" element={<ObjectivesList />} />
          <Route path="keyresults" element={<KeyResultsList />} />
          <Route path="kpis" element={<KpisList />} />
          <Route path="users" element={<UsersList />} />
          <Route path="roles" element={<RolesList />} />
          <Route path="groups" element={<GroupsList />} />
          <Route path="organizations" element={<OrganizationsList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
