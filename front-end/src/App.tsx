import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Dashboard } from "@/features/dashboard/Dashboard";
import { ObjectivesList } from "@/features/objectives/ObjectivesList";
import { KeyResultsList } from "@/features/keyresults/KeyResultsList";
import { KpisList } from "@/features/kpis/KpisList";
import { UsersList } from "@/features/users/UsersList";
import { UserDetail } from "@/features/users/UserDetail";
import { RolesList } from "@/features/roles/RolesList";
import { GroupsList } from "@/features/groups/GroupsList";
import { GroupDetail } from "@/features/groups/GroupDetail";
import { OrganizationsList } from "@/features/organizations/OrganizationsList";
import { OrganizationDetail } from "@/features/organizations/OrganizationDetail";
import { MyOKRs } from "@/features/myokrs/MyOKRs";
import { WebSocketProvider } from "@/lib/websocket";

function App() {
  return (
    <BrowserRouter>
      <WebSocketProvider>
        <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="objectives" element={<ObjectivesList />} />
          <Route path="keyresults" element={<KeyResultsList />} />
          <Route path="kpis" element={<KpisList />} />
          <Route path="users" element={<UsersList />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="roles" element={<RolesList />} />
          <Route path="groups" element={<GroupsList />} />
          <Route path="groups/:id" element={<GroupDetail />} />
          <Route path="organizations" element={<OrganizationsList />} />
          <Route path="organizations/:id" element={<OrganizationDetail />} />
          <Route path="my-okrs" element={<MyOKRs />} />
        </Route>
      </Routes>
      </WebSocketProvider>
    </BrowserRouter>
  );
}

export default App;
