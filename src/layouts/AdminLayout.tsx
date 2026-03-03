import { Header } from "../components/header/Header";
import { Sidebar } from "../components/sidebar/Sidebar";
import { Footer } from "../components/footer/Footer";
import { useState } from "react";
import { logoutApi } from "../api/auth.api";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmAlert } from "../ui";

type Props = {
  children: React.ReactNode;
};

export const AdminLayout = ({ children }: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { removeTokens } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      removeTokens();
      queryClient.clear();
      navigate("/login", { replace: true });
    },
    onError: () => {
      removeTokens();
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });

  const handleLogout = async () => {
     const confirmed = await confirmAlert();
     if(!confirmed) return;
     logout();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isPending={isPending}
      />

      <div className="flex flex-col flex-1">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6 overflow-x-auto overflow-y-auto min-w-0">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
};
