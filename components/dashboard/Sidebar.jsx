'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { Home, Folder, Menu, X, LogOut } from 'lucide-react';
import debounce from 'lodash/debounce';

import { getUserWorkspaces } from '@/lib/api/workspace';
import { cn, getPriorityBadgeStyles } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { WorkspaceForm } from './workspace/WorkspaceForm';

export function DashboardSidebar() {
  const { user, setUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [workspaces, setWorkspaces] = useState([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const fetchWorkspaces = useCallback(async () => {
    if (!user?.id) {
      setError('User ID is not available. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const response = await getUserWorkspaces(user.id);
      if (response.success) {
        setWorkspaces(response.data.map((item) => item.workspace));
      } else {
        setError('Failed to fetch workspaces from API');
      }
    } catch (error) {
      setError('Error fetching workspaces: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchWorkspaces();
    }
  }, [user, fetchWorkspaces]);

  const handleWorkspaceAdded = useCallback((newWorkspace) => {
    setWorkspaces((prev) => [...prev, newWorkspace]);
  }, []);

  // Updated logout handler with immediate redirect
  const handleLogout = useCallback(() => {
    try {
      // Remove all cookies
      Object.keys(Cookies.get()).forEach((cookieName) => {
        Cookies.remove(cookieName);
      });

      // Update auth context
      setUser(null);

      // Immediate redirect to home page
      window.location.href = '/';
    } catch (error) {
      //console.error('Logout error:', error);
      // Still redirect to home page even if there's an error
      window.location.href = '/';
    } finally {
      setShowLogoutConfirm(false);
    }
  }, [setUser]);

  const confirmLogout = useCallback(() => {
    setShowLogoutConfirm(true);
  }, []);

  const cancelLogout = useCallback(() => {
    setShowLogoutConfirm(false);
  }, []);

  const debouncedResize = useMemo(
    () =>
      debounce(() => {
        if (window.innerWidth >= 1024) {
          setIsMobileOpen(false);
        }
      }, 100),
    []
  );

  useEffect(() => {
    window.addEventListener('resize', debouncedResize);
    return () => {
      debouncedResize.cancel();
      window.removeEventListener('resize', debouncedResize);
    };
  }, [debouncedResize]);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const isDashboardActive = useMemo(() => pathname === '/dashboard', [pathname]);
  const isTasksActive = useMemo(() => pathname === '/dashboard/tasks', [pathname]);

  const MobileSidebarToggle = useCallback(
    () => (
      <div className="fixed top-4 left-4 z-40 lg:hidden">
        <Button variant="outline" size="icon" className="rounded-full bg-white shadow-md" onClick={() => setIsMobileOpen((prev) => !prev)}>
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
    ),
    [isMobileOpen]
  );

  return (
    <>
      <MobileSidebarToggle />
      <nav className={cn('flex flex-col w-72 bg-white overflow-y-auto border-r transition-all duration-300 ease-in-out', isMobileOpen ? 'fixed inset-0 z-30 translate-x-0 shadow-xl' : 'fixed -translate-x-full lg:static lg:translate-x-0')}>
        <ul className="flex flex-col gap-y-8 pl-6">
          {/* Logo */}
          <li className="mt-2">
            <Link href="/" className={cn('group flex items-center gap-x-3 rounded-md p-3 text-xl font-extrabold leading-relaxed pl-1 mt-5', pathname === '/' ? 'bg-[#CCDAF1] text-blue-800' : 'text-foreground hover:bg-gray-100')}>
              <Image width={40} height={40} src="https://res.cloudinary.com/dy8fe8tbe/image/upload/v1742279884/logo_ovq2n3.svg" className="w-10 h-10" alt="Scheduro Logo" />
              <span className="leading-none">Scheduro</span>
            </Link>
          </li>

          {/* Main Navigation */}
          <li>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className={cn('group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-relaxed', isDashboardActive ? 'bg-[#CCDAF1] text-blue-800' : 'text-foreground hover:bg-gray-100')}>
                  <Home className="w-6 h-6" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/tasks" className={cn('group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-relaxed', isTasksActive ? 'bg-[#CCDAF1] text-blue-800' : 'text-foreground hover:bg-gray-100')}>
                  <Folder className="w-6 h-6" />
                  My Tasks
                </Link>
              </li>
              <li>
                <button onClick={confirmLogout} className="group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-relaxed w-full text-left text-red-600 hover:bg-red-100">
                  <LogOut className="w-6 h-6" />
                  Logout
                </button>
              </li>
            </ul>
          </li>

          {/* Workspace Section */}
          <li>
            <div className="py-3 flex items-center justify-between px-4">
              <div className="py-2 text-sm font-bold leading-relaxed text-foreground">Workspaces</div>
              <WorkspaceForm onWorkspaceAdded={handleWorkspaceAdded} />
            </div>

            <ul className="mt-1 space-y-2">
              {error ? (
                <li className="text-sm text-red-600 px-3">{error}</li>
              ) : loading ? (
                <li className="text-sm text-gray-600 px-3">Loading...</li>
              ) : workspaces.length === 0 ? (
                <li className="text-sm text-gray-600 px-3">No workspaces created yet</li>
              ) : (
                workspaces.map((workspace) => (
                  <li key={workspace.id}>
                    <Link
                      href={`/dashboard/workspace/${workspace.slug}`}
                      className={cn(
                        'group flex w-full items-center justify-between rounded-md p-3 text-sm font-semibold leading-relaxed',
                        pathname === `/dashboard/workspace/${workspace.slug}` ? 'bg-[#CCDAF1] text-blue-800' : 'text-foreground hover:bg-gray-100'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {workspace.logoUrl ? (
                          <img src={workspace.logoUrl} alt={`${workspace.name} logo`} className="h-6 w-6 rounded-full object-cover" />
                        ) : (
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium border-foreground text-foreground">{workspace.name?.charAt(0).toUpperCase() || 'W'}</span>
                        )}
                        <span className="truncate" title={workspace.name}>
                          {workspace.name.length > 20 ? `${workspace.name.substring(0, 20)}...` : workspace.name}
                        </span>
                      </div>
                      <Badge variant="outline" className={cn('ml-auto text-xs font-medium', ...getPriorityBadgeStyles(workspace.priority))}>
                        {workspace.priority || 'Low'}
                      </Badge>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </li>
        </ul>
      </nav>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold text-foreground">Confirm Logout</h3>
            <p className="mt-2 text-sm text-gray-600">Are you sure you want to log out?</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={cancelLogout}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Yes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobileOpen && <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setIsMobileOpen(false)} />}
    </>
  );
}
