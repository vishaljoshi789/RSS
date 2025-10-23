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
  category: number;
}

interface Pad {
  id: number;
  name: string;
  description: string;
  level: number;
  level_name?: string;
  category_name?: string;
  total_positions: number;
  filled_positions: number;
}

const PadManagement = () => {
  const axios = useAxios();
  const [pads, setPads] = useState<Pad[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [filteredLevels, setFilteredLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPad, setCurrentPad] = useState<Pad | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    level: 0,
    total_positions: 1,
  });
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory > 0) {
      setFilteredLevels(levels.filter((l) => l.category === selectedCategory));
    } else {
      setFilteredLevels(levels);
    }
  }, [selectedCategory, levels]);

  const fetchData = async () => {
    // TODO: Uncomment when API is ready
    // try {
    //   setLoading(true);
    //   const [padsRes, categoriesRes, levelsRes] = await Promise.all([
    //     axios.get("/volunteer/pad/"),
    //     axios.get("/volunteer/category/"),
    //     axios.get("/volunteer/level/"),
    //   ]);
    //   setPads(padsRes.data.results || padsRes.data || []);
    //   setCategories(categoriesRes.data.results || categoriesRes.data || []);
    //   setLevels(levelsRes.data.results || levelsRes.data || []);
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
        { id: 1, name: "Junior Level", category: 1 },
        { id: 2, name: "Senior Level", category: 1 },
        { id: 3, name: "District Coordination", category: 2 },
      ];
      const dummyPads: Pad[] = [
        {
          id: 1,
          name: "Swayamsevak",
          description: "Basic volunteer",
          level: 1,
          total_positions: 5,
          filled_positions: 3,
        },
        {
          id: 2,
          name: "Sahayak",
          description: "Assistant volunteer",
          level: 1,
          total_positions: 3,
          filled_positions: 2,
        },
        {
          id: 3,
          name: "Mukhya Shikshak",
          description: "Chief instructor",
          level: 2,
          total_positions: 2,
          filled_positions: 1,
        },
        {
          id: 4,
          name: "Zila Karyavah",
          description: "District secretary",
          level: 3,
          total_positions: 1,
          filled_positions: 1,
        },
        {
          id: 5,
          name: "Zila Pracharak",
          description: "District organizer",
          level: 3,
          total_positions: 2,
          filled_positions: 0,
        },
      ];
      setCategories(dummyCategories);
      setLevels(dummyLevels);
      setPads(dummyPads);
      setLoading(false);
    }, 500);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Uncomment when API is ready
    // try {
    //   setSubmitting(true);
    //   await axios.post("/volunteer/pad/", formData);
    //   toast.success("Pad (Designation) created successfully");
    //   setIsCreateDialogOpen(false);
    //   setFormData({ name: "", description: "", level: 0, total_positions: 1 });
    //   setSelectedCategory(0);
    //   fetchData();
    // } catch (error: any) {
    //   toast.error(error.response?.data?.message || "Failed to create pad");
    // } finally {
    //   setSubmitting(false);
    // }

    // Dummy implementation for now
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Pad (Designation) created successfully");
      setIsCreateDialogOpen(false);
      setFormData({ name: "", description: "", level: 0, total_positions: 1 });
      setSelectedCategory(0);
      setSubmitting(false);
      fetchData();
    }, 500);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPad) return;
    // TODO: Uncomment when API is ready
    // try {
    //   setSubmitting(true);
    //   await axios.put(`/volunteer/pad/${currentPad.id}/`, formData);
    //   toast.success("Pad (Designation) updated successfully");
    //   setIsEditDialogOpen(false);
    //   setCurrentPad(null);
    //   setFormData({ name: "", description: "", level: 0, total_positions: 1 });
    //   setSelectedCategory(0);
    //   fetchData();
    // } catch (error: any) {
    //   toast.error(error.response?.data?.message || "Failed to update pad");
    // } finally {
    //   setSubmitting(false);
    // }

    // Dummy implementation for now
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Pad (Designation) updated successfully");
      setIsEditDialogOpen(false);
      setCurrentPad(null);
      setFormData({ name: "", description: "", level: 0, total_positions: 1 });
      setSelectedCategory(0);
      setSubmitting(false);
      fetchData();
    }, 500);
  };

  const handleDelete = async () => {
    if (!currentPad) return;
    // TODO: Uncomment when API is ready
    // try {
    //   setSubmitting(true);
    //   await axios.delete(`/volunteer/pad/${currentPad.id}/`);
    //   toast.success("Pad (Designation) deleted successfully");
    //   setIsDeleteDialogOpen(false);
    //   setCurrentPad(null);
    //   fetchData();
    // } catch (error: any) {
    //   toast.error(error.response?.data?.message || "Failed to delete pad");
    // } finally {
    //   setSubmitting(false);
    // }

    // Dummy implementation for now
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Pad (Designation) deleted successfully");
      setIsDeleteDialogOpen(false);
      setCurrentPad(null);
      setSubmitting(false);
      fetchData();
    }, 500);
  };

  const openEditDialog = (pad: Pad) => {
    setCurrentPad(pad);
    const level = levels.find((l) => l.id === pad.level);
    if (level) {
      setSelectedCategory(level.category);
    }
    setFormData({
      name: pad.name,
      description: pad.description,
      level: pad.level,
      total_positions: pad.total_positions,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (pad: Pad) => {
    setCurrentPad(pad);
    setIsDeleteDialogOpen(true);
  };

  const getLevelName = (levelId: number) => {
    return levels.find((l) => l.id === levelId)?.name || "Unknown";
  };

  const getCategoryName = (levelId: number) => {
    const level = levels.find((l) => l.id === levelId);
    if (level) {
      return categories.find((c) => c.id === level.category)?.name || "Unknown";
    }
    return "Unknown";
  };

  const filteredPads = pads.filter((pad) =>
    pad.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pad (Designation) Management</CardTitle>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Pad
            </Button>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search pads..."
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
                <TableHead>Level</TableHead>
                <TableHead>Total Positions</TableHead>
                <TableHead>Filled</TableHead>
                <TableHead>Vacant</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredPads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No pads found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPads.map((pad) => (
                  <TableRow key={pad.id}>
                    <TableCell className="font-medium">{pad.name}</TableCell>
                    <TableCell>{getCategoryName(pad.level)}</TableCell>
                    <TableCell>{getLevelName(pad.level)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{pad.total_positions}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{pad.filled_positions}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          pad.total_positions - pad.filled_positions === 0
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {pad.total_positions - pad.filled_positions}
                      </Badge>
                    </TableCell>
                    <TableCell>{pad.description}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(pad)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(pad)}
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
            <DialogTitle>Create Pad (Designation)</DialogTitle>
            <DialogDescription>
              Add a new designation with number of positions
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category" className="mb-2 block">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedCategory > 0 ? selectedCategory.toString() : ""}
                  onValueChange={(value) =>
                    setSelectedCategory(parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category first" />
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
                <Label htmlFor="level" className="mb-2 block">
                  Level <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.level > 0 ? formData.level.toString() : ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, level: parseInt(value) })
                  }
                  disabled={selectedCategory === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredLevels.map((level) => (
                      <SelectItem key={level.id} value={level.id.toString()}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="name" className="mb-2 block">
                  Pad Name (Designation) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Pracharak, Karyavah, etc."
                  required
                />
              </div>
              <div>
                <Label htmlFor="total_positions" className="mb-2 block">
                  Number of Positions <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="total_positions"
                  type="number"
                  min="1"
                  value={formData.total_positions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      total_positions: parseInt(e.target.value),
                    })
                  }
                  placeholder="Enter number of positions"
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
                  placeholder="Enter pad description"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setSelectedCategory(0);
                }}
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
            <DialogTitle>Edit Pad (Designation)</DialogTitle>
            <DialogDescription>Update pad details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-category" className="mb-2 block">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedCategory > 0 ? selectedCategory.toString() : ""}
                  onValueChange={(value) =>
                    setSelectedCategory(parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category first" />
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
                <Label htmlFor="edit-level" className="mb-2 block">
                  Level <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.level > 0 ? formData.level.toString() : ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, level: parseInt(value) })
                  }
                  disabled={selectedCategory === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredLevels.map((level) => (
                      <SelectItem key={level.id} value={level.id.toString()}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-name" className="mb-2 block">
                  Pad Name (Designation) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Pracharak, Karyavah, etc."
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-total_positions" className="mb-2 block">
                  Number of Positions <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-total_positions"
                  type="number"
                  min="1"
                  value={formData.total_positions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      total_positions: parseInt(e.target.value),
                    })
                  }
                  placeholder="Enter number of positions"
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
                  placeholder="Enter pad description"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedCategory(0);
                }}
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
            <DialogTitle>Delete Pad (Designation)</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentPad?.name}"? This will also
              remove all position assignments.
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

export default PadManagement;
