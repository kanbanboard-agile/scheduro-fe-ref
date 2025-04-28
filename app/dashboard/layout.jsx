import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Head from "next/head";
import { Toaster } from "sonner";


export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50 w-full">
        <DashboardSidebar />
        <main className="flex-1 w-full overflow-auto pt-16 lg:pt-0">
          {children}
        </main>
      </div>
      <Toaster position="top-center" theme="light" richColors />
    </SidebarProvider>
  );
}
