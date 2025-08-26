import {
  Calendar,
  UserRound,
  School,
  AppWindow,
  MessageCircle,
  LogOut,
  House,
  BookOpen,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";
// Menu items.
const items = [
  {
    title: "Trang chủ",
    url: "/",
    icon: House,
  },
  {
    title: "Quản lí user",
    url: "/manage-user",
    icon: UserRound,
  },
  {
    title: "Quản lí môn học",
    url: "/subjects",
    icon: BookOpen,
  },
  {
    title: "Lớp học",
    url: "/manage-class",
    icon: School,
  },
  {
    title: "Lịch học",
    url: "/timeschedule",
    icon: Calendar,
  },
  {
    title: "Đơn yêu cầu",
    url: "#",
    icon: AppWindow,
  },
  {
    title: "Phản hồi",
    url: "#",
    icon: MessageCircle,
  },
];

export function AppSidebar() {
  const path = usePathname();
  return (
    <Sidebar>
      <SidebarHeader className="p-0">
        <Image
          alt="LogoFPT"
          src="/2021-FPTU-Eng.jpg"
          width={100}
          height={10}
          className="w-full h-20 object-contain bg-zinc-50"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = path === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className={`flex items-center gap-2 rounded-md px-3 py-2 ${
                          isActive
                            ? "bg-orange-100 text-orange-600 font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="rounded-s-xl">
        <div className="flex items-center justify-between">
          <Button
            aria-label="Logout"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
