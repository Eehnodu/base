import { parseUserInfo, refreshExp } from "@/hooks/common/getCookie";
import { useRefreshToken } from "@/hooks/common/useAPI";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  FolderKanban,
  Folder,
  Users,
  MessageCircle,
  Settings,
  MapPin,
  ChartLine,
} from "lucide-react";
import { AdminMenuItem } from "@/types/admin/sidebar";
import AdminSidebar from "@/component/admin/sideBar/sideBar";
import AdminHeader from "@/component/admin/header/header";

const AdminLayout = () => {
  const user = parseUserInfo("admin");
  const isRefresh = refreshExp();
  const refresh = useRefreshToken();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  useEffect(() => {
    if (!user && isRefresh) {
      refresh()
        .then(() => {
          window.location.reload();
        })
        .catch(() => {});
    }
    if ((!user && !isRefresh) || user.auth_type != "admin") {
      navigate("/admin/login");
    }
  }, []);

  const handleToggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  // ===================================
  // 사이드 바 및 헤더 아이템 처리
  const adminMenu: AdminMenuItem[] = [
    {
      type: "link",
      label: "설정",
      icon: Settings,
      to: "/admin",
    },
    {
      type: "link",
      label: "로그",
      icon: MessageCircle,
      to: "/admin/logs",
    },
    {
      type: "group",
      title: "그룹",
      icon: Folder,
      children: [
        { label: "그룹1", to: "/admin/group1", icon: Users },
        { label: "그룹2", to: "/admin/group2", icon: Users },
      ],
    },
  ];

  const routeTitle: Record<string, string> = adminMenu.reduce(
    (acc, item) => {
      if (item.type === "link") {
        acc[item.to] = item.label;
      } else {
        item.children.forEach((child) => {
          acc[child.to] = child.label;
        });
      }
      return acc;
    },
    {} as Record<string, string>
  );

  const getTitleByPath = (pathname: string) => {
    const key = Object.keys(routeTitle)
      .sort((a, b) => b.length - a.length)
      .find((k) => pathname === k || pathname.startsWith(k + "/"));

    return (key && routeTitle[key]) || "Unknown Mode";
  };
  // ===================================

  return (
    <div
      className="flex h-screen w-full overflow-hidden"
      style={{
        backgroundColor: "var(--admin-bg)",
        color: "var(--admin-text)",
      }}
    >
      <AdminSidebar collapsed={sidebarCollapsed} adminMenu={adminMenu} />

      <main className="flex h-screen flex-1 flex-col min-w-0">
        <AdminHeader
          onToggleSidebar={handleToggleSidebar}
          getTitleByPath={getTitleByPath}
        />
        <section className="flex-1 px-4 py-5 min-h-0">
          <div className="w-full h-full min-h-0 overflow-y-auto">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
