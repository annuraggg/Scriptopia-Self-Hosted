import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { IconUserQuestion, IconUsers } from "@tabler/icons-react";

const Sidebar = () => {
  const topItems = [
    {
      icon: IconUsers,
      label: "Active Candidates",
      link: "/active",
    },
    {
      icon: IconUserQuestion,
      label: "Pending Verification",
      link: "/pending",
    },
  ];

  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setActive(window.location.pathname.split("/")[2]);
  }, []);

  return (
    <>
      <aside
        className={` sticky h-[100vh] min-w-16 px-5 top-0 left-0 hidden transition-width flex-col border-r bg-background sm:flex overflow-x-hidden ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <nav className={`flex flex-col gap-4 sm:py-5 `}>
          {topItems.map((item) => (
            <table>
              <tbody
                className={` cursor-pointer h-8 ${
                  active === item.label.toLowerCase() ? " text-accent" : ""
                } `}
                onClick={() => {
                  navigate(`/candidates${item.link}`);
                  setActive(item.label.toLowerCase());
                }}
              >
                <tr>
                  <td className="pr-3">
                    {item.icon && <item.icon className="h-7 w-5" />}
                  </td>
                  {collapsed ? null : (
                    <td className="text-start w-full">{item.label}</td>
                  )}
                </tr>
              </tbody>
            </table>
          ))}
        </nav>

        <div className={` flex w-full mb-5 bottom-0 absolute `}>
          <ChevronRight
            className={`h-5 w-5 text-muted-foreground transition-all  opacity-50 ${
              !collapsed ? "rotate-180" : ""
            }`}
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
