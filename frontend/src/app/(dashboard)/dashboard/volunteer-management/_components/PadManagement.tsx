"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Pencil, Trash2, Search, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWings, useLevels, useDesignations } from "@/module/dashboard/volunteer";
import type { Designation, DesignationFormData } from "@/module/dashboard/volunteer";

const PadManagement = () => {
  const { wings } = useWings();
  const { levels } = useLevels();
  const { designations, loading, createDesignation, updateDesignation, deleteDesignation } = useDesignations();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentDesignation, setCurrentDesignation] = useState<Designation | null>(null);
  const [formData, setFormData] = useState<DesignationFormData>({
    title: "",
    level: 0,
    total_positions: 1,
  });
  const [selectedWing, setSelectedWing] = useState<number>(0);
  const [filteredLevels, setFilteredLevels] = useState(levels);
  const [submitting, setSubmitting] = useState(false);

  // Filter levels when wing selection changes
  useEffect(() => {
    if (selectedWing > 0) {
      setFilteredLevels((levels || []).filter((l) => l.wing === selectedWing));
    } else {
      setFilteredLevels(levels || []);
    }
  }, [selectedWing, levels]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.level || !formData.total_positions) return;
    
    try {
      setSubmitting(true);
      await createDesignation(formData);
      setIsCreateDialogOpen(false);
      setFormData({ title: "", level: 0, total_positions: 1 });
      setSelectedWing(0);
    } catch (error) {
      // Error already handled by hook
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDesignation || !formData.title.trim() || !formData.level) return;

    try {
      setSubmitting(true);
      await updateDesignation(currentDesignation.id, formData);
      setIsEditDialogOpen(false);
      setCurrentDesignation(null);
      setFormData({ title: "", level: 0, total_positions: 1 });
      setSelectedWing(0);
    } catch (error) {
      // Error already handled by hook
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentDesignation) return;

    try {
      setSubmitting(true);
      await deleteDesignation(currentDesignation.id);
      setIsDeleteDialogOpen(false);
      setCurrentDesignation(null);
    } catch (error) {
      // Error already handled by hook
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (designation: Designation) => {
    setCurrentDesignation(designation);
    setFormData({
      title: designation.title,
      level: designation.level,
      total_positions: designation.total_positions,
    });
    // Set the wing based on the level
    const level = (levels || []).find((l) => l.id === designation.level);
    if (level) {
      setSelectedWing(level.wing);
    }
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (designation: Designation) => {
    setCurrentDesignation(designation);
    setIsDeleteDialogOpen(true);
  };

  const getLevelName = (levelId: number) => {
    return (levels || []).find((l) => l.id === levelId)?.name || "Unknown";
  };

  const getWingName = (levelId: number) => {
    const level = (levels || []).find((l) => l.id === levelId);
    if (level) {
      return (wings || []).find((w) => w.id === level.wing)?.name || "Unknown";
    }
    return "Unknown";
  };

  const filteredDesignations = (designations || []).filter((designation) =>
    designation.title.toLowerCase().includes(searchTerm.toLowerCase())
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
                <TableHead>Title</TableHead>
                <TableHead>Wing</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Total Positions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                      <p>Loading designations...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredDesignations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Award className="h-12 w-12 mb-4 opacity-50" />
                      <h3 className="font-semibold text-lg mb-1">No designations found</h3>
                      <p className="text-sm mb-4">
                        {searchTerm
                          ? `No designations match "${searchTerm}"`
                          : "Create wings and levels first, then add designations"}
                      </p>
                      {!searchTerm && wings.length > 0 && levels.length > 0 && (
                        <Button
                          onClick={() => setIsCreateDialogOpen(true)}
                          size="sm"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Designation
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDesignations.map((designation) => (
                  <TableRow key={designation.id}>
                    <TableCell className="font-medium">{designation.title}</TableCell>
                    <TableCell>{getWingName(designation.level)}</TableCell>
                    <TableCell>{getLevelName(designation.level)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{designation.total_positions}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(designation)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(designation)}
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
                <Label htmlFor="wing" className="mb-2 block">
                  Wing <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedWing > 0 ? selectedWing.toString() : ""}
                  onValueChange={(value) => setSelectedWing(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select wing first" />
                  </SelectTrigger>
                  <SelectContent>
                    {wings.map((wing) => (
                      <SelectItem key={wing.id} value={wing.id.toString()}>
                        {wing.name}
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
                  disabled={selectedWing === 0}
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
                <Label htmlFor="title" className="mb-2 block">
                  Pad Title (Designation) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
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
                  value={formData.total_positions || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      total_positions: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="Enter number of positions"
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setSelectedWing(0);
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
                <Label htmlFor="edit-wing" className="mb-2 block">
                  Wing <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedWing > 0 ? selectedWing.toString() : ""}
                  onValueChange={(value) => setSelectedWing(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select wing first" />
                  </SelectTrigger>
                  <SelectContent>
                    {wings.map((wing) => (
                      <SelectItem key={wing.id} value={wing.id.toString()}>
                        {wing.name}
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
                  disabled={selectedWing === 0}
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
                <Label htmlFor="edit-title" className="mb-2 block">
                  Pad Title (Designation) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
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
                  value={formData.total_positions || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      total_positions: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="Enter number of positions"
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedWing(0);
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
              Are you sure you want to delete "{currentDesignation?.title}"? This will also
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
