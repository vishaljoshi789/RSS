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
import {
  useWings,
  useLevels,
  useDesignations,
} from "@/module/dashboard/volunteer";
import ErrorState from "@/components/status/ErrorState";
import type {
  Designation,
  DesignationFormData,
} from "@/module/dashboard/volunteer";
import { toast } from "sonner";

const PadManagement = () => {
  const { wings, error: wingsError, refetch: refetchWings } = useWings();
  const { levels, error: levelsError, refetch: refetchLevels } = useLevels();
  const {
    designations,
    loading,
    error: designationsError,
    createDesignation,
    updateDesignation,
    deleteDesignation,
    refetch: refetchDesignations,
  } = useDesignations();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentDesignation, setCurrentDesignation] =
    useState<Designation | null>(null);
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
    if (!formData.title.trim() || !formData.level || !formData.total_positions)
      return;

    try {
      setSubmitting(true);
      await createDesignation(formData);
      setIsCreateDialogOpen(false);
      setFormData({ title: "", level: 0, total_positions: 1 });
      setSelectedWing(0);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create level";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDesignation || !formData.title.trim() || !formData.level)
      return;

    try {
      setSubmitting(true);
      await updateDesignation(currentDesignation.id, formData);
      setIsEditDialogOpen(false);
      setCurrentDesignation(null);
      setFormData({ title: "", level: 0, total_positions: 1 });
      setSelectedWing(0);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create level";
      toast.error(message);
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
      const message =
        error instanceof Error ? error.message : "Failed to create level";
      toast.error(message);
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

  const combinedError = wingsError || levelsError || designationsError;
  if (combinedError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pad (Designation) Management</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState
            title="Error loading designations"
            message={combinedError}
            onRetry={() => {
              refetchWings();
              refetchLevels();
              refetchDesignations();
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <CardTitle className="text-lg sm:text-xl">Pad (Designation) Management</CardTitle>
            <Button onClick={() => setIsCreateDialogOpen(true)} size="sm" className="w-full sm:w-auto">
              <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Add Pad</span>
            </Button>
          </div>
          <div className="relative mt-3 sm:mt-4">
            <Search className="absolute left-2 sm:left-3 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search pads..."
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
                <TableHead className="text-xs sm:text-sm">Title</TableHead>
                <TableHead className="hidden md:table-cell text-xs sm:text-sm">Wing</TableHead>
                <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Level</TableHead>
                <TableHead className="hidden lg:table-cell text-xs sm:text-sm">Total Positions</TableHead>
                <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 sm:py-12">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary mb-3 sm:mb-4"></div>
                      <p className="text-xs sm:text-sm">Loading designations...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredDesignations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 sm:py-12">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Award className="h-8 w-8 sm:h-12 sm:w-12 mb-3 sm:mb-4 opacity-50" />
                      <h3 className="font-semibold text-sm sm:text-lg mb-1">
                        No designations found
                      </h3>
                      <p className="text-xs sm:text-sm mb-3 sm:mb-4">
                        {searchTerm
                          ? `No designations match "${searchTerm}"`
                          : "Create wings and levels first, then add designations"}
                      </p>
                      {!searchTerm && wings.length > 0 && levels.length > 0 && (
                        <Button
                          onClick={() => setIsCreateDialogOpen(true)}
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="text-xs sm:text-sm">Add Designation</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDesignations.map((designation) => (
                  <TableRow key={designation.id}>
                    <TableCell className="font-medium text-xs sm:text-sm">
                      <div>{designation.title}</div>
                      <div className="sm:hidden mt-1 space-y-1">
                        <div className="text-xs text-muted-foreground">
                          {getLevelName(designation.level)}
                        </div>
                        <div className="md:hidden text-xs text-muted-foreground">
                          {getWingName(designation.level)}
                        </div>
                        <div className="lg:hidden">
                        <Badge variant="outline" className="text-xs">
                          {designation.total_positions} positions
                        </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs sm:text-sm">{getWingName(designation.level)}</TableCell>
                    <TableCell className="hidden sm:table-cell text-xs sm:text-sm">{getLevelName(designation.level)}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge variant="outline" className="text-xs">
                        {designation.total_positions}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(designation)}
                        className="h-8 w-8 sm:h-9 sm:w-9"
                      >
                        <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(designation)}
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
                  Pad Title (Designation){" "}
                  <span className="text-red-500">*</span>
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
                  Pad Title (Designation){" "}
                  <span className="text-red-500">*</span>
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
              Are you sure you want to delete &quot;{currentDesignation?.title}&quot;?
              This will also remove all position assignments.
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
