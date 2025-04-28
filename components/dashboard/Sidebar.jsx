"use client";
import { getPriorityBadgeStyles } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Calendar, Home, Folder, Menu, X, LogOut } from "lucide-react";
import { getUserWorkspaces } from "@/lib/api/workspace";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { WorkspaceForm } from "./workspace/WorkspaceForm";
import { Button } from "../ui/button";
import Cookies from "js-cookie";
import { useAuth } from "@/lib/AuthContext";

export function DashboardSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [workspaces, setWorkspaces] = useState([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        // Validasi user dan userId
        if (!user || !user.id) {
          console.error("User ID is undefined. Skipping API call.");
          setError("User ID is not available. Please log in again.");
          setLoading(false);
          return;
        }

        const userId = user.id; // Ambil userId dari user
        // console.log("User ID:", userId);

        const response = await getUserWorkspaces(userId);

        if (response.success) {
          const workspaceData = response.data.map((item) => item.workspace);
          // console.log("Mapped workspaces:", workspaceData);
          setWorkspaces(workspaceData);
        } else {
          setError("Failed to fetch workspaces from API");
        }
      } catch (error) {
        console.error("Error details:", error);
        setError("Error fetching workspaces: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    // Panggil fetchWorkspaces hanya jika user tersedia
    if (user) {
      fetchWorkspaces();
    }
  }, [user]);

  const handleWorkspaceAdded = (newWorkspace) => {
    setWorkspaces((prev) => [...prev, newWorkspace]);
  };

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      // Clear all cookies
      Object.keys(Cookies.get()).forEach((cookieName) => {
        Cookies.remove(cookieName);
      });

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const MobileSidebarToggle = () => (
    <div className="fixed top-4 left-4 z-40 lg:hidden">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-white shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>
    </div>
  );

  return (
    <>
      <MobileSidebarToggle />

      <Sidebar
        collapsible="none"
        className={cn(
          "border-r transition-all duration-300 ease-in-out",
          isMobileOpen
            ? "fixed inset-0 z-30 w-64 translate-x-0 shadow-xl"
            : "fixed -translate-x-full lg:static lg:translate-x-0"
        )}
      >
        <SidebarHeader className="py-4">
          <div className="flex items-center gap-2 px-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-500 text-white">
              <Image width={500} height={500} src="https://res.cloudinary.com/dy8fe8tbe/image/upload/v1742279884/logo_ovq2n3.svg" className="w-10 h-10" alt="Scheduro Logo" />
            </div>
            <span className="text-xl font-bold">Scheduro</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "mb-1",
                      pathname === "/dashboard" &&
                      "bg-blue-100 text-blue-600 hover:bg-blue-100 hover:text-blue-600"
                    )}
                  >
                    <Link href="/dashboard" className="flex items-center gap-3">
                      <Home className="h-5 w-5" />
                      <span className="font-medium text-blue-600">
                        Dashboard
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      pathname === "/dashboard/tasks" &&
                      "bg-blue-100 text-blue-600 hover:bg-blue-100 hover:text-blue-600"
                    )}
                  >
                    <Link
                      href="/dashboard/tasks"
                      className="flex items-center gap-3"
                    >
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M8 3H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1" />
                        <path d="M12 3v6" />
                        <path d="M9 6h6" />
                        <path d="M9 14h6" />
                        <path d="M9 18h6" />
                      </svg>
                      <span className="font-medium">My Tasks</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-red-600 hover:bg-red-100 hover:text-red-600 cursor-pointer"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup className="mt-6">
            <div className="flex items-center justify-between px-4">
              <SidebarGroupLabel className="text-xs font-bold text-black">
                WORKSPACES
              </SidebarGroupLabel>
              <WorkspaceForm onWorkspaceAdded={handleWorkspaceAdded} />
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {error ? (
                  <SidebarMenuItem>{error}</SidebarMenuItem>
                ) : loading ? (
                  <SidebarMenuItem>Loading...</SidebarMenuItem>
                ) : workspaces.length === 0 ? (
                  <SidebarMenuItem className="ms-3">
                    No workspaces created yet
                  </SidebarMenuItem>
                ) : (
                  workspaces.map((workspace) => (
                    <SidebarMenuItem key={workspace.id}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "group flex items-center gap-3 rounded-md h-auto transition-all duration-200 bg-indigo-50",
                          pathname === `/dashboard/workspace/${workspace.id}`
                            ? "bg-blue-100 text-blue-600"
                            : "hover:bg-gray-100 hover:text-gray-800"
                        )}
                      >
                        <Link
                          href={`/dashboard/workspace/${workspace.slug}`}
                          className="flex items-center gap-3 w-full"
                        >
                          {workspace.logoUrl ? (
                            <img
                              src={workspace.logoUrl}
                              alt={`${workspace.name} logo`}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                              {workspace.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span
                            className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200 truncate"
                            title={workspace.name} // Tooltip untuk menampilkan nama lengkap
                          >
                            {workspace.name.length > 20
                              ? `${workspace.name.substring(0, 20)}...` // Potong nama jika lebih dari 20 karakter
                              : workspace.name}
                          </span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "ml-auto text-xs font-medium",
                              ...getPriorityBadgeStyles(workspace.priority)
                            )}
                          >
                            {workspace.priority || "Low"}
                          </Badge>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
