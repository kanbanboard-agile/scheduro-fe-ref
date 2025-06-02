'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function UserProfileCard({ isLoading, user }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleEditClick = () => {
    toast.info('Features is coming soon!');
  };

  const handleResetPassword = () => {
    const email = encodeURIComponent(user?.email || '');
    router.push(`/forget?email=${email}`);
  };

  // Mobile profile modal
  const MobileProfileModal = () => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100/80 bg-opacity-50 z-50 p-4">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-md h-auto">
          {isLoading ? (
            <>
              <div className="text-center border-b pb-4">
                <Skeleton className="w-14 h-14 mx-auto rounded-full" />
                <Skeleton className="h-5 w-24 mt-2 mx-auto" />
                <Skeleton className="h-4 w-32 mt-1 mx-auto" />
              </div>
              <div className="mt-4">
                <Skeleton className="h-6 w-32 mx-auto mb-4" />
                <ul className="mt-2 space-y-2">
                  {Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <li key={index} className="flex items-center p-2 bg-gray-100 rounded-md shadow space-x-3">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div className="flex flex-col space-y-2">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="text-center border-b pb-4 relative">
                <button className="absolute top-0 right-0 text-gray-500 hover:text-gray-700" onClick={() => setIsOpen(false)} aria-label="Close profile modal">
                  ✖
                </button>
                <img
                  src={user?.avatar || 'https://res.cloudinary.com/dy8fe8tbe/image/upload/v1742238102/user_profile_grka1i.svg'}
                  className="w-14 h-14 mx-auto rounded-full"
                  alt="User avatar"
                  onError={(e) => {
                    // console.error('Failed to load avatar:', user?.avatar);
                    e.target.src = 'https://res.cloudinary.com/dy8fe8tbe/image/upload/v1742238102/user_profile_grka1i.svg';
                  }}
                />
                <p className="text-lg font-medium mt-2">{user?.name || 'N/A'}</p>
                <p className="text-sm text-gray-500">{user?.email || 'N/A'}</p>
                <div className="mt-4 flex flex-col space-y-3">
                  <button onClick={handleEditClick} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Edit Profile
                  </button>
                  <button
                    onClick={handleResetPassword}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    Reset Password
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Card className="p-4 rounded-lg text-center border border-[#6387CE]">
        {isLoading ? (
          <>
            <Skeleton className="w-14 h-14 mx-auto rounded-full" />
            <Skeleton className="h-5 w-24 mt-2 mx-auto" />
            <Skeleton className="h-4 w-32 mt-1 mx-auto" />
          </>
        ) : (
          <>
            <img
              src={user?.avatar || 'https://res.cloudinary.com/dy8fe8tbe/image/upload/v1742238102/user_profile_grka1i.svg'}
              className="w-14 h-14 mx-auto rounded-full cursor-pointer"
              alt="User avatar"
              onClick={() => setIsOpen(true)}
              role="button"
              aria-label="Open profile"
              tabIndex={0}
              onError={(e) => {
                // console.error('Failed to load avatar:', user?.avatar);
                e.target.src = 'https://res.cloudinary.com/dy8fe8tbe/image/upload/v1742238102/user_profile_grka1i.svg';
              }}
            />
            <p className="text-lg font-medium mt-2">{user?.name || 'N/A'}</p>
            <p className="text-sm text-gray-500">{user?.email || 'N/A'}</p>
          </>
        )}
      </Card>
      <MobileProfileModal />
    </>
  );
}
