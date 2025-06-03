// components/CreateWorkspace.jsx
'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { PRIORITY } from '@/lib/utils';
import { createWorkspace } from '@/lib/api/workspace';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function WorkspaceForm({ onWorkspaceAdded }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    name: '',
    priority: PRIORITY.HIGH,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) handleReset();
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!data.name.trim()) {
      setErrors({ name: 'Workspace title is required' });
      return;
    }

    const validPriority = Object.values(PRIORITY).includes(data.priority) ? data.priority : PRIORITY.MEDIUM;

    const payload = {
      name: data.name,
      logoUrl: data.logoUrl,
      priority: validPriority,
    };

    setIsSubmitting(true);
    try {
      const response = await createWorkspace(payload);
      const newWorkspace = response.workspace || {
        id: Date.now(),
        name: data.name,
        slug: data.name.toLowerCase().replace(/\s+/g, '-'),
        priority: validPriority,
      };

      if (onWorkspaceAdded) {
        onWorkspaceAdded(newWorkspace); // Perbarui state di sisi klien
      }

      toast.success(response.message || 'Workspace created successfully');
      setOpen(false);
    } catch (error) {
      console.error('Error creating workspace:', error);
      toast.error(error.message || 'Failed to create workspace');
      if (error.response?.data?.message) {
        setErrors({ server: error.response.data.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setData({ name: '', priority: PRIORITY.HIGH });
    setErrors({});
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="flex h-5 w-5 items-center justify-center rounded-md hover:bg-gray-100">
          <Plus className="h-4 w-4" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 !max-w-full rounded-l-2xl p-6 bg-gray-50 border-l shadow-xl">
        <SheetHeader className="mb-4 md:-ml-4">
          <SheetTitle className="text-base font-semibold">Add Workspace</SheetTitle>
          <p className="text-sm text-muted-foreground">Add new workspace</p>
        </SheetHeader>

        <div className="flex justify-center">
          <Image src="https://res.cloudinary.com/dwgwb5vro/image/upload/v1741447763/buku_yxhzod.png" width={300} height={200} alt="Workspace Illustration" className="w-full max-w-xs" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div>
            <label htmlFor="name" className="text-sm font-medium">
              Title
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter title"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              autoFocus
              className={`mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${errors.name ? 'focus:ring-red-500' : 'focus:ring-blue-300'}`}
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* <div>
              <label htmlFor="logoUrl" className="text-sm font-medium">
                Logo URL
              </label>
              <input
                id="logoUrl"
                name="logoUrl"
                type="text"
                placeholder="Enter image URL"
                value={data.logoUrl}
                onChange={(e) => setData({ ...data, logoUrl: e.target.value })}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                disabled={isSubmitting}
              />
            </div> */}

          <div>
            <label htmlFor="priority" className="text-sm font-medium">
              Priority
            </label>
            <Select value={data.priority} onValueChange={(value) => setData({ ...data, priority: value })} disabled={isSubmitting}>
              <SelectTrigger className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PRIORITY.URGENT}>Urgent</SelectItem>
                <SelectItem value={PRIORITY.HIGH}>High</SelectItem>
                <SelectItem value={PRIORITY.MEDIUM}>Medium</SelectItem>
                <SelectItem value={PRIORITY.LOW}>Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {errors.server && <p className="text-sm text-red-600 mt-1">{errors.server}</p>}

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" className="bg-gray-300 text-gray-700" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-400 cursor-pointer" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
