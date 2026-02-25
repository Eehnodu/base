import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { AdminHeaderProps } from "@/types/admin/sidebar";

const AdminHeader = ({ onToggleSidebar, getTitleByPath }: AdminHeaderProps) => {
  const { pathname } = useLocation();
  const pageTitle = getTitleByPath(pathname);

  return (
    <header
      className="
        flex h-16 items-center gap-3 px-4
        border-b bg-sub2 text-main border-gray-300
      "
    >
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="사이드바 토글"
        className="
          flex h-8 w-8 items-center justify-center rounded-md
          hover:bg-sub2-hover active:bg-sub2-active
          transition-colors
        "
      >
        <Menu className="h-6 w-6 text-main" />
      </button>

      <h1 className="text-lg font-semibold text-main">{pageTitle}</h1>
    </header>
  );
};

export default AdminHeader;
