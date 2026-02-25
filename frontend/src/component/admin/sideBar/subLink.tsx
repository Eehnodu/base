import { SubLinkProps } from "@/types/admin/sidebar";
import { NavLink } from "react-router-dom";

const SubLink = ({
  to,
  label,
  nested = false,
  collapsed = false,
  icon: Icon,
}: SubLinkProps) => {
  const base =
    "flex items-center rounded-lg select-none transition-all duration-200 min-w-0";

  const sizeClass = nested ? "text-sm" : "text-lg";

  const paddingClass = (() => {
    if (collapsed) return "justify-center px-3 py-2";
    if (nested) return "pl-8 pr-3 py-2";
    return "px-4 py-2";
  })();

  const gapClass = collapsed ? "" : "gap-3";

  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        isActive
          ? `${base} ${sizeClass} ${paddingClass} ${gapClass} bg-white/10 text-white font-medium`
          : `${base} ${sizeClass} ${paddingClass} ${gapClass} text-neutral-400 hover:bg-white/5 hover:text-white/90`
      }
    >
      {Icon ? <Icon className="h-4 w-4 shrink-0" /> : null}

      <span
        className={`min-w-0 truncate whitespace-nowrap transition-all duration-300 ease-in-out ${
          collapsed ? "w-0 opacity-0 overflow-hidden -ml-1" : "opacity-100"
        }`}
        style={{
          transition: "opacity 300ms ease, width 300ms ease, margin 300ms ease",
        }}
      >
        {label}
      </span>
    </NavLink>
  );
};

export default SubLink;
