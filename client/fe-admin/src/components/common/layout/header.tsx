import { SidebarTrigger } from "@/components/ui/sidebar";
import { logout } from "@/utils/logout";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white shadow px-4 py-2 w-full">
      <div className="flex justify-between items-center w-full px-2">
        {/* Left */}
        <SidebarTrigger />

        {/* Center */}
        <Image src="/2021-FPTU-Eng.jpg" alt="FPT" width={120} height={20} />

        {/* Right */}
        <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => logout()}>
          Logout
        </button>
      </div>
    </header>
  );
}
