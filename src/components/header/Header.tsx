import { useLocation } from "react-router";
import { SidebarItems } from "../sidebar/Sidebar";
import { Icons } from "../../ui";

type HeaderProps = {
  onMenuClick: () => void;
};

export const Header = ({ onMenuClick }: HeaderProps) => {
  const location = useLocation();
  return (
    <header className="h-19 bg-white border-b border-gray-500 flex items-center justify-between px-6">
      {SidebarItems.filter((item) => item.path === location.pathname).map(
        (item) => (
          <div key={item.path} className="flex gap-2 flex-row items-center">
            <item.icon size={25} />
            <span>{item.title}</span>
          </div>
        )
      )}

      <div className="flex items-center gap-4">
        <button className="lg:hidden" onClick={onMenuClick}>
          <Icons.Menu size={24} />
        </button>
      </div>
    </header>
  );
};
