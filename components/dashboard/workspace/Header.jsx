"use client";
import { Building2, Pencil, Trash } from "lucide-react"; // Tambahkan Trash
import { Button } from "@/components/ui/button"; // Gunakan Button dari shadcn
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Import Dialog dari shadcn
import { useState } from "react";
import { updateWorkspace, deleteWorkspace } from "@/lib/api/workspace"; // Pastikan deleteWorkspace diimpor
import { toast, Toaster } from "sonner";

const Header = ({ workspace, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedName, setEditedName] = useState(workspace?.name || "Workspace");
  const [editedPriority, setEditedPriority] = useState(
    workspace?.priority || "Normal"
  );

  const handleSave = async () => {
    try {
      const response = await updateWorkspace({
        id: workspace.id,
        name: editedName,
        priority: editedPriority,
      });

      if (response.success) {
        console.log("Workspace updated successfully:", response.data);
        if (editedName !== workspace.name) {
          toast.success("Workspace name updated! Redirecting...");
          setTimeout(() => {
            window.location.href = "/dashboard";
            setTimeout(() => {
              window.location.href = `/dashboard/workspace/${response.data.slug}`;
            }, 1000);
          }, 1000);
        } else {
          onUpdate(response.data);
          toast.success("Workspace updated successfully!");
          window.location.reload();
        }
      } else {
        console.error("Failed to update workspace:", response.message);
        toast.error("Failed to update workspace.");
      }
    } catch (error) {
      console.error("Error updating workspace:", error);
      toast.error("An error occurred while updating the workspace.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteWorkspace({ id: workspace.id });

      if (response.success) {
        toast.success("Workspace deleted successfully!");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        console.error("Failed to delete workspace:", response.message);
        toast.error("Failed to delete workspace.");
      }
    } catch (error) {
      console.error("Error deleting workspace:", error);
      toast.error("An error occurred while deleting the workspace.");
    }
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 md:p-6 shadow-lg">
      <Toaster position="top-center" theme="light" richColors />
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left side - Workspace info */}
          <div className="flex items-center space-x-4">
            <div className="bg-gray-700 p-2 rounded-xl shadow-md">
              <Building2 className="h-6 w-6 text-blue-400" />
            </div>
            <div className="flex items-center gap-3">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="text-2xl md:text-3xl font-semibold tracking-tight bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    autoFocus
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white border-none rounded-lg px-4 py-1.5 font-medium"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gray-600 hover:bg-gray-700 text-white border-none rounded-lg px-4 py-1.5 font-medium"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                    {editedName}
                  </h1>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-9 w-9 hover:bg-gray-700 text-yellow-400 transition-colors"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-9 w-9 hover:bg-gray-700 text-red-400 transition-colors"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 text-white border border-gray-700 rounded-xl">
                      <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription className="text-gray-300">
                          Are you sure you want to delete this workspace? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          className="bg-gray-600 hover:bg-gray-700 text-white border-none"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={async () => {
                            await handleDelete();
                          }}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
