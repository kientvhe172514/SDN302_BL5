import {
  Calendar,
  UserRound,
  School,
  AppWindow,
  MessageCircle,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Menu items.
const items = [
  {
    title: "Quản lí user",
    url: "/manage-user",
    icon: UserRound,
  },
  {
    title: "Lớp học",
    url: "#",
    icon: School,
  },
  {
    title: "Lịch học",
    url: "#",
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
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="rounded-s-xl">
        <div className="flex items-center justify-between">
          <Button
            aria-label="Logout"
            variant="outline"
            className="w-full flex items-center justify-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
