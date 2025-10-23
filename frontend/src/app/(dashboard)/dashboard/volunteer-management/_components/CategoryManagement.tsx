"use client";

import React, { useState, useEffect } from "react";
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
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import useAxios from "@/hooks/use-axios";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  level_count?: number;
}

const CategoryManagement = () => {
  const axios = useAxios();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    // TODO: Uncomment when API is ready
    // try {
    //   setLoading(true);
    //   const response = await axios.get("/volunteer/category/");
    //   setCategories(response.data.results || response.data || []);
    // } catch (error: any) {
    //   toast.error(error.response?.data?.message || "Failed to fetch categories");
    // } finally {
    //   setLoading(false);
    // }

    // Dummy data for now
    setLoading(true);
    setTimeout(() => {
      const dummyData: Category[] = [
        {
          id: 1,
          name: "Shakha Level",
          description: "Local branch level volunteers",
          created_at: "2024-01-15T10:30:00Z",
          level_count: 2,
        },
        {
          id: 2,
          name: "Zila Level",
          description: "District level coordination",
          created_at: "2024-01-16T11:00:00Z",
          level_count: 1,
        },
        {
          id: 3,
          name: "Prant Level",
          description: "State level management",
          created_at: "2024-01-17T09:15:00Z",
          level_count: 0,
        },
      ];
      setCategories(dummyData);
      setLoading(false);
    }, 500);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Uncomment when API is ready
    // try {
    //   setSubmitting(true);
    //   await axios.post("/volunteer/category/", formData);
    //   toast.success("Category created successfully");
    //   setIsCreateDialogOpen(false);
    //   setFormData({ name: "", description: "" });
    //   fetchCategories();
    // } catch (error: any) {
    //   toast.error(error.response?.data?.message || "Failed to create category");
    // } finally {
    //   setSubmitting(false);
    // }

    // Dummy implementation for now
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Category created successfully");
      setIsCreateDialogOpen(false);
      setFormData({ name: "", description: "" });
      setSubmitting(false);
      fetchCategories();
    }, 500);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCategory) return;
    // TODO: Uncomment when API is ready
    // try {
    //   setSubmitting(true);
    //   await axios.put(`/volunteer/category/${currentCategory.id}/`, formData);
    //   toast.success("Category updated successfully");
    //   setIsEditDialogOpen(false);
    //   setCurrentCategory(null);
    //   setFormData({ name: "", description: "" });
    //   fetchCategories();
    // } catch (error: any) {
    //   toast.error(error.response?.data?.message || "Failed to update category");
    // } finally {
    //   setSubmitting(false);
    // }

    // Dummy implementation for now
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Category updated successfully");
      setIsEditDialogOpen(false);
      setCurrentCategory(null);
      setFormData({ name: "", description: "" });
      setSubmitting(false);
      fetchCategories();
    }, 500);
  };

  const handleDelete = async () => {
    if (!currentCategory) return;
    // TODO: Uncomment when API is ready
    // try {
    //   setSubmitting(true);
    //   await axios.delete(`/volunteer/category/${currentCategory.id}/`);
    //   toast.success("Category deleted successfully");
    //   setIsDeleteDialogOpen(false);
    //   setCurrentCategory(null);
    //   fetchCategories();
    // } catch (error: any) {
    //   toast.error(error.response?.data?.message || "Failed to delete category");
    // } finally {
    //   setSubmitting(false);
    // }

    // Dummy implementation for now
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Category deleted successfully");
      setIsDeleteDialogOpen(false);
      setCurrentCategory(null);
      setSubmitting(false);
      fetchCategories();
    }, 500);
  };

  const openEditDialog = (category: Category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setCurrentCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Category Management</CardTitle>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Levels</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>
                      <Badge>{category.level_count || 0} Levels</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(category)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
            <DialogDescription>Add a new volunteer category</DialogDescription>
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
                  placeholder="Enter category name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description" className="mb-2 block">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter category description"
                  rows={3}
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
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category details</DialogDescription>
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
                  placeholder="Enter category name"
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
                  placeholder="Enter category description"
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
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentCategory?.name}"? This action
              cannot be undone.
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

export default CategoryManagement;
