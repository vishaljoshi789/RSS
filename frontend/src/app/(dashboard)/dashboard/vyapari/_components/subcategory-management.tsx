"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Image as ImageIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import type { Category, SubCategory, SubCategoryFormData } from "../types";
import Image from "next/image";

export default function SubCategoryManagement() {
  const axios = useAxios();

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Form states
  const [currentSubCategory, setCurrentSubCategory] =
    useState<SubCategory | null>(null);
  const [formData, setFormData] = useState<SubCategoryFormData>({
    category: 0,
    name: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch categories and subcategories
  const fetchData = async (search?: string) => {
    try {
      setLoading(true);
      const searchParam = search ? `?search=${encodeURIComponent(search)}` : "";
      const [categoriesRes, subcategoriesRes] = await Promise.all([
        axios.get("/vyapari/category/"),
        axios.get(`/vyapari/subcategory/${searchParam}`),
      ]);
      setCategories(categoriesRes.data.results || categoriesRes.data || []);
      setSubcategories(
        subcategoriesRes.data.results || subcategoriesRes.data || []
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData(searchTerm);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ category: 0, name: "", description: "" });
    setImageFile(null);
    setImagePreview(null);
    setCurrentSubCategory(null);
  };

  // Get category name by ID
  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  // Handle create
  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.category) {
      toast.error("Name and category are required");
      return;
    }

    if (!imageFile) {
      toast.error("SubCategory image is required");
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append("category", formData.category.toString());
      data.append("name", formData.name);
      if (formData.description)
        data.append("description", formData.description);
      data.append("image", imageFile);

      await axios.post("/vyapari/subcategory/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("SubCategory created successfully");

      setIsCreateDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error(
        error.response?.data?.name?.[0] || "Failed to create subcategory"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit
  const openEditDialog = (subcategory: SubCategory) => {
    setCurrentSubCategory(subcategory);
    setFormData({
      category: subcategory.category,
      name: subcategory.name,
      description: subcategory.description || "",
    });
    setImagePreview(subcategory.image);
    setIsEditDialogOpen(true);
  };

  const handleEdit = async () => {
    if (!currentSubCategory || !formData.name.trim() || !formData.category) {
      toast.error("Name and category are required");
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append("category", formData.category.toString());
      data.append("name", formData.name);
      if (formData.description)
        data.append("description", formData.description);
      if (imageFile) data.append("image", imageFile);

      await axios.put(`/vyapari/subcategory/${currentSubCategory.id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("SubCategory updated successfully");

      setIsEditDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error(
        error.response?.data?.name?.[0] || "Failed to update subcategory"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const openDeleteDialog = (subcategory: SubCategory) => {
    setCurrentSubCategory(subcategory);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!currentSubCategory) return;

    try {
      setSubmitting(true);
      await axios.delete(`/vyapari/subcategory/${currentSubCategory.id}/`);

      toast.success("SubCategory deleted successfully");

      setIsDeleteDialogOpen(false);
      setCurrentSubCategory(null);
      fetchData();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete subcategory"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>SubCategories</CardTitle>
            <CardDescription>Manage business subcategories</CardDescription>
          </div>
          <Button
            title="Add SubCategory"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add SubCategory
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Search */}
        <div className="mb-4 flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subcategories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : subcategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No subcategories found
                  </TableCell>
                </TableRow>
              ) : (
                subcategories.map((subcategory) => (
                  <TableRow key={subcategory.id}>
                    <TableCell>
                      {subcategory.image ? (
                        <div className="relative h-12 w-12 overflow-hidden rounded">
                          <Image
                            src={subcategory.image}
                            alt={subcategory.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded bg-muted">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getCategoryName(subcategory.category)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {subcategory.name}
                    </TableCell>
                    <TableCell>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {subcategory.description || "No description"}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          title="Edit"
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(subcategory)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          title="Delete"
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(subcategory)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
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

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create SubCategory</DialogTitle>
            <DialogDescription>
              Add a new business subcategory
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category" className="mb-2 block">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={
                  formData.category > 0 ? formData.category.toString() : ""
                }
                onValueChange={(value) =>
                  setFormData({ ...formData, category: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                placeholder="Enter subcategory name"
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
                placeholder="Enter subcategory description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="image" className="mb-2 block">
                Image <span className="text-red-500">*</span>
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              {imagePreview && (
                <div className="mt-2 relative h-32 w-32 overflow-hidden rounded">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              title="Cancel"
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button title="Create" onClick={handleCreate} disabled={submitting}>
              {submitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit SubCategory</DialogTitle>
            <DialogDescription>Update subcategory details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-category" className="mb-2 block">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={
                  formData.category > 0 ? formData.category.toString() : ""
                }
                onValueChange={(value) =>
                  setFormData({ ...formData, category: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                placeholder="Enter subcategory name"
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
                placeholder="Enter subcategory description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-image" className="mb-2 block">
                Image
              </Label>
              <Input
                id="edit-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2 relative h-32 w-32 overflow-hidden rounded">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              title="Cancel"
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button title="Update" onClick={handleEdit} disabled={submitting}>
              {submitting ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete SubCategory</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "
              <b>{currentSubCategory?.name.toUpperCase()}</b>"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              title="Cancel"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setCurrentSubCategory(null);
              }}
            >
              Cancel
            </Button>
            <Button
              title="Delete"
              variant="destructive"
              onClick={handleDelete}
              disabled={submitting}
            >
              {submitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </Card>
  );
}
