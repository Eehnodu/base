import GroupLink from "./groupLink";
import SubLink from "./subLink";
import Profile from "@/assets/profile.png";
import { LogOut } from "lucide-react";
import { usePost } from "@/hooks/common/useAPI";
import { useNavigate } from "react-router-dom";
import { AdminSidebarProps } from "@/types/admin/sidebar";

const AdminSidebar = ({ collapsed, adminMenu }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const logoutMutation = usePost<void, void>("api/auth/logout_admin");

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate("/admin/login"),
    });
  };

  return (
    <aside
      className={`
        h-screen flex-col overflow-hidden border-r transition-all duration-300 ease-in-out
        bg-main text-sub2 border-sub1
        ${collapsed ? "w-0 border-0" : "w-64"}
      `}
    >
      <div
        className="flex h-full flex-col"
        style={{
          width: collapsed ? 0 : 256,
          minWidth: 0,
          transition: "width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* 프로필 영역 */}
        <div className="flex h-16 items-center px-4 gap-3 flex-shrink-0 border-b border-sub1">
          <img
            src={Profile}
            alt="Profile"
            className="h-10 w-10 rounded-full border border-sub1"
          />
          <div className="flex flex-col overflow-hidden">
            <span className="text-base font-semibold truncate text-white">
              관리자
            </span>
          </div>
        </div>

        {/* 메뉴 리스트 */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <div className="flex flex-col gap-2">
            {adminMenu.map((item, idx) =>
              item.type === "link" ? (
                <SubLink
                  key={`${item.to}-${idx}`}
                  to={item.to}
                  label={item.label}
                  icon={item.icon}
                  collapsed={collapsed}
                />
              ) : (
                <GroupLink
                  key={`${item.title}-${idx}`}
                  item={item}
                  collapsed={collapsed}
                />
              )
            )}
          </div>
        </nav>

        {/* 로그아웃 */}
        <div className="px-3 py-3 flex-shrink-0 border-t border-sub1">
          <button
            type="button"
            onClick={handleLogout}
            className="
              w-full flex items-center gap-3 rounded-md px-2 py-1 text-sm
              font-medium text-sub2 hover:text-white
              bg-transparent hover:bg-main-hover active:bg-main-active
              transition-all duration-200
            "
          >
            <LogOut className="h-4 w-4 text-sub2/70" />
            <span className="truncate whitespace-nowrap">로그아웃</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
