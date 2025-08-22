import { Header } from "@/components/common/layout/header";
import { AppSidebar } from "@/components/common/layout/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar cố định bên trái */}
        <AppSidebar />

        {/* Nội dung chính chiếm toàn bộ phần còn lại */}
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
