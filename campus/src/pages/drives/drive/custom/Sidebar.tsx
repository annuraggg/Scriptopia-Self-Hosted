import { DriveContext } from "@/types/DriveContext";
import { useNavigate, useOutletContext } from "react-router-dom";

interface NavItem {
  label: string;
  _id: string;
}

interface SidebarProps {
  active: string;
  setActive: (id: string) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ active, setActive, isMobile, onClose }: SidebarProps) => {
  const { drive } = useOutletContext<DriveContext>();
  const navigate = useNavigate();

  const navItems: NavItem[] =
    drive?.workflow?.steps
      .filter((step) => step.type === "CUSTOM")
      .map((step) => ({
        label: step.name,
        _id: step._id!,
      })) || [];

  const handleNavigation = (item: NavItem) => {
    const path = import.meta.env.VITE_BASENAME === "/"
      ? `/drives/${drive._id}/custom`
      : `/drives/${drive._id}/custom/${item._id!}`;

    setActive(item._id!);
    navigate(path);
    if (isMobile) onClose?.();
  };

  const renderNavItem = (item: NavItem) => {
    return (
      <div onClick={() => handleNavigation(item)}>
        <div
          className={`flex items-center p-2 py-3 rounded-lg cursor-pointer transition-colors duration-200
              ${
                active === item._id!
                  ? "bg-primary text-foreground"
                  : "text-default hover:bg-accent/40"
              }`}
        >
          <span className="ml-3 text-sm font-medium">{item.label}</span>
        </div>
      </div>
    );
  };

  return (
    <aside
      className="h-[100vh] bg-foreground text-background rounded-r-2xl
        flex flex-col overflow-hidden transition-all duration-300 border-l border-l-background/10 w-[300px] relative"
    >
      <nav className="flex flex-col gap-2 p-3 flex-grow">
        {navItems.map((item) => renderNavItem(item))}
      </nav>
    </aside>
  );
};

export default Sidebar;
