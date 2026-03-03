import { NavLink } from "react-router";
import { Icons } from "../../ui/Icons/icon";
import { Button, Spinner } from "../../ui";
import clsx from "clsx";

export const SidebarItems = [
  {
    title: "Dashboard",
    icon: Icons.Dashboard,
    path: "/admin/dashboard",
  },
  {
    title: "User Management",
    icon: Icons.UserManagement,
    path: "/admin/user-management",
  },
  {
    title: "Verification",
    icon: Icons.Verification,
    path: "/admin/verification",
  },
  {
    title: "Commission & Payouts",
    icon: Icons.CommissionPayout,
    path: "/admin/commission-payout",
  },
  {
    title: "Wallet & Transactions",
    icon: Icons.WalletTransactions,
    path: "/admin/wallet-transaction",
  },
  {
    title: "Coin Management",
    icon: Icons.Coin,
    path: "/admin/coin-management",
  },
  {
    title: "Offer & Festival management",
    icon: Icons.OfferFestival,
    path: "/admin/offer-festival",
  },
  {
    title: "Security",
    icon: Icons.Secure,
    path: "/admin/security",
  },
];

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  isPending: boolean;
};

export const Sidebar = ({ isOpen, onClose, onLogout, isPending }: SidebarProps) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          "fixed lg:static z-50 bg-gray-900 text-white min-h-screen transition-all duration-300",
          "w-72",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="p-6 text-xl font-bold border-b border-gray-700">
          Admin Panel
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-2">
          {SidebarItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-4 py-2 rounded",
                  isActive ? "bg-gray-700" : "hover:bg-gray-800"
                )
              }
            >
              <item.icon size={22} />
              <span className="font-semibold text-sm">{item.title}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-6 mt-auto">
          <Button variant="secondary" onClick={onLogout} className="w-full">
            {isPending ? <Spinner/> : 'Logout'}
          </Button>
        </div>
      </aside>
    </>
  );
};
