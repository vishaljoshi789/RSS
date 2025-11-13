"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search, FolderOpen } from "lucide-react";
import { useWings } from "@/module/dashboard/volunteer";
import ErrorState from "@/components/status/ErrorState";
import type { Wing, WingFormData } from "@/module/dashboard/volunteer";

const WingManagement = () => {
  const { wings, loading, error, refetch, createWing, updateWing, deleteWing } = useWings();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentWing, setCurrentWing] = useState<Wing | null>(null);
  const [formData, setFormData] = useState<WingFormData>({
    name: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSubmitting(true);
      await createWing(formData);
      setIsCreateDialogOpen(false);
      setFormData({ name: "", description: "" });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error restoring form data:", error);
        sessionStorage.removeItem("volunteer_registration_data");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWing || !formData.name.trim()) return;

    try {
      setSubmitting(true);
      await updateWing(currentWing.id, formData);
      setIsEditDialogOpen(false);
      setCurrentWing(null);
      setFormData({ name: "", description: "" });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error restoring form data:", error);
        sessionStorage.removeItem("volunteer_registration_data");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentWing) return;

    try {
      setSubmitting(true);
      await deleteWing(currentWing.id);
      setIsDeleteDialogOpen(false);
      setCurrentWing(null);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error restoring form data:", error);
        sessionStorage.removeItem("volunteer_registration_data");
      }
    } finally {
      setSubmitting(false);
    }
  };
  const openEditDialog = (wing: Wing) => {
    setCurrentWing(wing);
    setFormData({
      name: wing.name,
      description: wing.description,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (wing: Wing) => {
    setCurrentWing(wing);
    setIsDeleteDialogOpen(true);
  };

  const filteredWings = (wings || []).filter((wing) =>
    wing.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Wing Management</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ErrorState title="Error loading wings" message={error} onRetry={refetch} />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <CardTitle className="text-lg sm:text-xl">Wing Management</CardTitle>
            <Button onClick={() => setIsCreateDialogOpen(true)} size="sm" className="w-full sm:w-auto">
              <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Add Wing</span>
            </Button>
          </div>
          <div className="relative mt-3 sm:mt-4">
            <Search className="absolute left-2 sm:left-3 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search wings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 sm:pl-10 h-9 sm:h-10 text-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">Name</TableHead>
                <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Description</TableHead>
                <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 sm:py-12">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary mb-3 sm:mb-4"></div>
                      <p className="text-xs sm:text-sm">Loading wings...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredWings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 sm:py-12">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <FolderOpen className="h-8 w-8 sm:h-12 sm:w-12 mb-3 sm:mb-4 opacity-50" />
                      <h3 className="font-semibold text-sm sm:text-lg mb-1">
                        No wings found
                      </h3>
                      <p className="text-xs sm:text-sm mb-3 sm:mb-4">
                        {searchTerm
                          ? `No wings match "${searchTerm}"`
                          : "Get started by creating your first wing"}
                      </p>
                      {!searchTerm && (
                        <Button
                          onClick={() => setIsCreateDialogOpen(true)}
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="text-xs sm:text-sm">Add Wing</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredWings.map((wing) => (
                  <TableRow key={wing.id}>
                    <TableCell className="font-medium text-xs sm:text-sm">
                      <div>{wing.name}</div>
                      <div className="sm:hidden text-xs text-muted-foreground mt-1">{wing.description}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs sm:text-sm">{wing.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(wing)}
                        className="h-8 w-8 sm:h-9 sm:w-9"
                      >
                        <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(wing)}
                        className="h-8 w-8 sm:h-9 sm:w-9"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Wing</DialogTitle>
            <DialogDescription>Add a new volunteer wing</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="mb-2 block">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter wing name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description" className="mb-2 block">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter wing description"
                  rows={3}
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Wing</DialogTitle>
            <DialogDescription>Update wing details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name" className="mb-2 block">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter wing name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-description" className="mb-2 block">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter wing description"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Wing</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{currentWing?.name}&quot;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={submitting}
            >
              {submitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WingManagement;
