import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import LoginPage from "./container/admin/login";
import AdminLayout from "./container/admin/layout";
import NotFoundPage from "./container/notfound";
import AdminSetting from "./container/admin/setting";
import AdminLogs from "./container/admin/logs";
import WsPage from "./container/ws";
import ClientLayOut from "./container/client/layout";
import ClientMain from "./container/client/main";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<ClientLayOut />}>
                <Route path="/" element={<ClientMain />}></Route>
              </Route>

              <Route path="/admin/login" element={<LoginPage />} />
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminSetting />} />
                <Route path="/admin/logs" element={<AdminLogs />} />
              </Route>
              <Route path="/ws" element={<WsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
