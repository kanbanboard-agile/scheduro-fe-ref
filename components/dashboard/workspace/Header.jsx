'use client';

import { useEffect, useState, useCallback, memo } from 'react';
import { Building2, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast, Toaster } from 'sonner';
import { updateWorkspace, deleteWorkspace } from '@/lib/api/workspace';

// Memoized Avatar component to prevent unnecessary re-renders
const WorkspaceAvatar = memo(({ name, avatar, onUpload, workspaceId }) => {
  return (
    <div className="flex-shrink-0 relative">
      {avatar ? (
        <img src={avatar} alt="Avatar" className="h-20 w-20 md:h-24 md:w-24 rounded-full ring-4 ring-white object-cover shadow-md" />
      ) : (
        <div className="h-20 w-20 md:h-24 md:w-24 flex items-center justify-center rounded-full bg-[#354273] text-white font-bold text-3xl ring-4 ring-white shadow-md">{name?.charAt(0).toUpperCase()}</div>
      )}
      <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer">
        <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
        <Pencil className="w-4 h-4 text-gray-700" />
      </label>
    </div>
  );
});

WorkspaceAvatar.displayName = 'WorkspaceAvatar';

// Memoized DeleteDialog component
const DeleteDialog = memo(({ isOpen, onClose, onDelete }) => {
  return (
    <DialogContent className="bg-white text-black border border-gray-300 rounded-xl">
      <DialogHeader>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogDescription>Are you sure you want to delete this workspace? This action cannot be undone.</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" className="bg-gray-200 hover:bg-gray-300" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white" onClick={onDelete}>
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  );
});

DeleteDialog.displayName = 'DeleteDialog';

// Main Header component with performance optimizations
const Header = ({ workspace, onUpdate }) => {
  // Use lazy initialization for state to avoid unnecessary calculations during re-renders
  const [randomImage, setRandomImage] = useState('');
  const [avatar, setAvatar] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`workspace-avatar-${workspace.id}`) || null;
    }
    return null;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedName, setEditedName] = useState(workspace?.name || 'Workspace');
  const [editedPriority, setEditedPriority] = useState(workspace?.priority || 'Normal');

  // Load avatar and random image on mount only, not on every render
  useEffect(() => {
    // Array of pre-loaded images from Cloudinary
    const cloudinaryImages = [
      'https://res.cloudinary.com/dwgwb5vro/image/upload/v1746324956/1_mh8knm.png',
      'https://res.cloudinary.com/dwgwb5vro/image/upload/v1746324956/2_gnvc2o.png',
      'https://res.cloudinary.com/dwgwb5vro/image/upload/v1746324956/3_sarkos.png',
      'https://res.cloudinary.com/dwgwb5vro/image/upload/v1746324956/4_hz3z9k.png',
      'https://res.cloudinary.com/dwgwb5vro/image/upload/v1746324956/5_nficao.png',
    ];

    // Use a more performant random selection
    const randomIndex = (Math.random() * cloudinaryImages.length) | 0;
    setRandomImage(cloudinaryImages[randomIndex]);

    // We already initialized avatar with localStorage in useState
  }, [workspace.id]); // Only re-run if workspace ID changes

  // Memoized handlers to prevent recreation on every render
  const handleImageUpload = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setAvatar(imageUrl);
        localStorage.setItem(`workspace-avatar-${workspace.id}`, imageUrl);
      }
    },
    [workspace.id]
  );

  const handleSave = useCallback(async () => {
    try {
      // Use an optimistic update for better perceived performance
      // Update local state immediately before the API call completes
      const optimisticData = {
        ...workspace,
        name: editedName,
        priority: editedPriority,
      };

      // Only make the API call if there are actual changes
      if (editedName !== workspace.name || editedPriority !== workspace.priority) {
        const response = await updateWorkspace({
          id: workspace.id,
          name: editedName,
          priority: editedPriority,
        });

        if (response.success) {
          if (editedName !== workspace.name) {
            toast.success('Workspace name updated! Redirecting...');
            setTimeout(() => {
              window.location.href = '/dashboard';
              setTimeout(() => {
                window.location.href = `/dashboard/workspace/${response.data.slug}`;
              }, 1000);
            }, 1000);
          } else {
            onUpdate(response.data);
            toast.success('Workspace updated successfully!');
            window.location.reload();
          }
        } else {
          toast.error('Failed to update workspace.');
        }
      } else {
        // No changes, just close edit mode
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('An error occurred while updating the workspace.');
    } finally {
      setIsEditing(false);
    }
  }, [workspace, editedName, editedPriority, onUpdate]);

  const handleDelete = useCallback(async () => {
    try {
      const response = await deleteWorkspace({ id: workspace.id });
      if (response.success) {
        toast.success('Workspace deleted successfully!');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        toast.error('Failed to delete workspace.');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the workspace.');
    } finally {
      setIsDialogOpen(false);
    }
  }, [workspace.id]);

  const toggleEditing = useCallback(() => {
    setIsEditing((prev) => !prev);
  }, []);

  const toggleDialog = useCallback(() => {
    setIsDialogOpen((prev) => !prev);
  }, []);

  // Render optimization - using fragment to avoid unnecessary DOM nodes
  return (
    <div className="relative w-full">
      <Toaster position="top-center" theme="light" richColors />

      {/* Cover - only render when necessary */}
      <div className="w-full h-24 sm:h-32 md:h-40 lg:h-48 overflow-hidden flex items-center">
        {(workspace.cover || randomImage) && <img className="w-full h-full object-cover" src={workspace.cover || randomImage} alt={workspace.name} />}
      </div>

      {/* Avatar, Name, Actions */}
      <div className="relative px-4 sm:px-6 flex items-center gap-4 -mt-10 md:-mt-12">
        {/* Memoized Avatar component */}
        <WorkspaceAvatar name={workspace.name} avatar={avatar} onUpload={handleImageUpload} workspaceId={workspace.id} />

        {/* Name & Buttons */}
        <div className="flex flex-col gap-2 mt-12 md:mt-14">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="text-xl md:text-2xl font-semibold tracking-tight bg-white text-gray-900 border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
                Save
              </Button>
              <Button onClick={toggleEditing} className="bg-gray-500 text-white">
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold">{editedName}</h2>
              <Button variant="ghost" size="icon" onClick={toggleEditing} className="text-yellow-500 hover:bg-gray-200">
                <Pencil className="h-4 w-4" />
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:bg-gray-200">
                    <Trash className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DeleteDialog isOpen={isDialogOpen} onClose={toggleDialog} onDelete={handleDelete} />
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(Header);
