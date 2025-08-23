'use client'; 
import { Header } from "@/components/common/layout/header";
import { AppSidebar } from "@/components/common/layout/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Providers } from '@/app/providers';
import { usePathname } from "next/navigation";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/authentication/login';

  // Nếu là trang login, chỉ hiển thị nội dung chính
  if (isLoginPage) {
    return (
      <main className="flex-grow">
        <Providers>{children}</Providers>
      </main>
    );
  }
  // Nếu là các trang khác, hiển thị layout đầy đủ với Sidebar
  return (
    <SidebarProvider> {/* Bao bọc toàn bộ layout */}
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 p-4 overflow-y-auto">
            <Providers>{children}</Providers>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}