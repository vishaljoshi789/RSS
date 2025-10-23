"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
}

interface Level {
  id: number;
  name: string;
  description: string;
  category: number;
  category_name?: string;
  order: number;
  pad_count?: number;
}

const LevelManagement = () => {
  const axios = useAxios();
  const [levels, setLevels] = useState<Level[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: 0,
    order: 1,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // TODO: Uncomment when API is ready
    // try {
    //   setLoading(true);
    //   const [levelsRes, categoriesRes] = await Promise.all([
    //     axios.get("/volunteer/level/"),
    //     axios.get("/volunteer/category/"),
    //   ]);
    //   setLevels(levelsRes.data.results || levelsRes.data || []);
    //   setCategories(categoriesRes.data.results || categoriesRes.data || []);
    // } catch (error: any) {
    //   toast.error(error.response?.data?.message || "Failed to fetch data");
    // } finally {
    //   setLoading(false);
    // }

    // Dummy data for now
    setLoading(true);
    setTimeout(() => {
      const dummyCategories: Category[] = [
        { id: 1, name: "Shakha Level" },
        { id: 2, name: "Zila Level" },
        { id: 3, name: "Prant Level" },
      ];
      const dummyLevels: Level[] = [
        {
          id: 1,
          name: "Junior Level",
          description: "Entry level positions",
          category: 1,
          order: 1,
          pad_count: 2,
        },
        {
          id: 2,
          name: "Senior Level",
          description: "Experienced volunteers",
          category: 1,
          order: 2,
          pad_count: 1,
        },
        {
          id: 3,
          name: "District Coordination",
          description: "District level management",
          category: 2,
          order: 1,
          pad_count: 2,
        },
      ];
      setCategories(dummyCategories);
      setLevels(dummyLevels);
      setLoading(false);
    }, 500);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Uncomment when API is ready
    // try {
    //   setSubmitting(true);
    //   await axios.post("/volunteer/level/", formData);
    //   toast.success("Level created successfully");
    //   setIsCreateDialogOpen(false);
    //   setFormData({ name: "", description: "", category: 0, order: 1 });
    //   fetchData();
    // } catch (error: any) {
    //   toast.error(error.response?.data?.message || "Failed to create level");
    // } finally {
    //   setSubmitting(false);
    // }

    // Dummy implementation for now
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Level created successfully");
      setIsCreateDialogOpen(false);
      setFormData({ name: "", description: "", category: 0, order: 1 });
      setSubmitting(false);
      fetchData();
    }, 500);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLevel) return;
    // TODO: Uncomment when API is ready
    // try {
    //   setSubmitting(true);
    //   await axios.put(`/volunteer/level/${currentLevel.id}/`, formData);
    //   toast.success("Level updated successfully");
    //   setIsEditDialogOpen(false);
    //   setCurrentLevel(null);
    //   setFormData({ name: "", description: "", category: 0, order: 1 });
    //   fetchData();
    // } catch (error: any) {
    //   toast.error(error.response?.data?.message || "Failed to update level");
    // } finally {
    //   setSubmitting(false);
    // }

    // Dummy implementation for now
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Level updated successfully");
      setIsEditDialogOpen(false);
      setCurrentLevel(null);
      setFormData({ name: "", description: "", category: 0, order: 1 });
      setSubmitting(false);
      fetchData();
    }, 500);
  };

  const handleDelete = async () => {
    if (!currentLevel) return;
    // TODO: Uncomment when API is ready
    // try {
    //   setSubmitting(true);
    //   await axios.delete(`/volunteer/level/${currentLevel.id}/`);
    //   toast.success("Level deleted successfully");
    //   setIsDeleteDialogOpen(false);
    //   setCurrentLevel(null);
    //   fetchData();
    // } catch (error: any) {
    //   toast.error(error.response?.data?.message || "Failed to delete level");
    // } finally {
    //   setSubmitting(false);
    // }

    // Dummy implementation for now
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Level deleted successfully");
      setIsDeleteDialogOpen(false);
      setCurrentLevel(null);
      setSubmitting(false);
      fetchData();
    }, 500);
  };

  const openEditDialog = (level: Level) => {
    setCurrentLevel(level);
    setFormData({
      name: level.name,
      description: level.description,
      category: level.category,
      order: level.order,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (level: Level) => {
    setCurrentLevel(level);
    setIsDeleteDialogOpen(true);
  };

  const getCategoryName = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown";
  };

  const filteredLevels = levels.filter((level) =>
    level.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Level Management</CardTitle>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Level
            </Button>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search levels..."
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
                <TableHead>Category</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Pads</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredLevels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No levels found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLevels.map((level) => (
                  <TableRow key={level.id}>
                    <TableCell className="font-medium">{level.name}</TableCell>
                    <TableCell>{getCategoryName(level.category)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{level.order}</Badge>
                    </TableCell>
                    <TableCell>{level.description}</TableCell>
                    <TableCell>
                      <Badge>{level.pad_count || 0} Pads</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(level)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(level)}
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
            <DialogTitle>Create Level</DialogTitle>
            <DialogDescription>Add a new level to a category</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category" className="mb-2 block">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category > 0 ? formData.category.toString() : ""}
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
                  placeholder="Enter level name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="order" className="mb-2 block">
                  Order <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="order"
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: parseInt(e.target.value) })
                  }
                  placeholder="Enter order"
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
                  placeholder="Enter level description"
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
            <DialogTitle>Edit Level</DialogTitle>
            <DialogDescription>Update level details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-category" className="mb-2 block">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category > 0 ? formData.category.toString() : ""}
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
                  placeholder="Enter level name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-order" className="mb-2 block">
                  Order <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-order"
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: parseInt(e.target.value) })
                  }
                  placeholder="Enter order"
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
                  placeholder="Enter level description"
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
            <DialogTitle>Delete Level</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentLevel?.name}"? This action
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

export default LevelManagement;
