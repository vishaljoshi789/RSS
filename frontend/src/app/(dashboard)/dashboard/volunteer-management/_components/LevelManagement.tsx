"use client";

import React, { useState } from "react";
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
import { Plus, Pencil, Trash2, Search, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWings, useLevels } from "@/module/dashboard/volunteer";
import ErrorState from "@/components/status/ErrorState";
import type { Level, LevelFormData } from "@/module/dashboard/volunteer";
import { toast } from "sonner";

const LevelManagement = () => {
  const { wings, error: wingsError, refetch: refetchWings } = useWings();
  const { levels, loading, error: levelsError, createLevel, updateLevel, deleteLevel, refetch: refetchLevels } =
    useLevels();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [formData, setFormData] = useState<LevelFormData>({
    name: [],
    wing: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.length || !formData.wing) return;

    try {
      setSubmitting(true);
      await createLevel(formData);
      setIsCreateDialogOpen(false);
      setFormData({ name: [], wing: 0 });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create level";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const LEVEL_OPTIONS = [
    { en: "National", hi: "राष्ट्रीय" },
    { en: "State", hi: "प्रदेश" },
    { en: "Division", hi: "संभाग/मंडल" },
    { en: "District", hi: "जिला" },
    { en: "City/Village", hi: "नगर/ग्राम" },
  ];

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLevel || !formData.name.length || !formData.wing) return;

    try {
      setSubmitting(true);
      await updateLevel(currentLevel.id, formData);
      setIsEditDialogOpen(false);
      setCurrentLevel(null);
      setFormData({ name: [], wing: 0 });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create level";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentLevel) return;

    try {
      setSubmitting(true);
      await deleteLevel(currentLevel.id);
      setIsDeleteDialogOpen(false);
      setCurrentLevel(null);
    }catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create level";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (level: Level) => {
    setCurrentLevel(level);
    setFormData({
      name: Array.isArray(level.name) ? level.name : [level.name],
      wing: level.wing,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (level: Level) => {
    setCurrentLevel(level);
    setIsDeleteDialogOpen(true);
  };

  const getWingName = (wingId: number) => {
    return (wings || []).find((w) => w.id === wingId)?.name || "Unknown";
  };

  const filteredLevels = (levels || []).filter((level) => {
    const nameVal = Array.isArray(level.name)
      ? level.name.join(" ")
      : level.name ?? "";
    return nameVal.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const combinedError = wingsError || levelsError;
  if (combinedError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Level Management</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState
            title="Error loading levels"
            message={combinedError}
            onRetry={() => {
              refetchWings();
              refetchLevels();
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
            <CardTitle className="text-lg sm:text-xl">Level Management</CardTitle>
            <Button onClick={() => setIsCreateDialogOpen(true)} size="sm" className="w-full sm:w-auto">
              <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Add Level</span>
            </Button>
          </div>
          <div className="relative mt-3 sm:mt-4">
            <Search className="absolute left-2 sm:left-3 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search levels..."
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
                <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Wing</TableHead>
                <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 sm:py-12">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary mb-3 sm:mb-4"></div>
                      <p className="text-xs sm:text-sm">Loading levels...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredLevels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 sm:py-12">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Layers className="h-8 w-8 sm:h-12 sm:w-12 mb-3 sm:mb-4 opacity-50" />
                      <h3 className="font-semibold text-sm sm:text-lg mb-1">
                        No levels found
                      </h3>
                      <p className="text-xs sm:text-sm mb-3 sm:mb-4">
                        {searchTerm
                          ? `No levels match "${searchTerm}"`
                          : "Create wings first, then add levels to organize them"}
                      </p>
                      {!searchTerm && wings.length > 0 && (
                        <Button
                          onClick={() => setIsCreateDialogOpen(true)}
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="text-xs sm:text-sm">Add Level</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {filteredLevels.map((level, index) => (
                    <TableRow key={`${level.id}-${index}`}>
                      <TableCell className="font-medium text-xs sm:text-sm">
                        <div>
                        {Array.isArray(level.name)
                          ? level.name.join(", ")
                          : level.name}
                        </div>
                        <div className="sm:hidden mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {getWingName(level.wing)}
                        </Badge>
                        </div>
                      </TableCell>

                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="secondary" className="text-xs">
                          {getWingName(level.wing)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(level)}
                          className="h-8 w-8 sm:h-9 sm:w-9"
                        >
                          <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(level)}
                          className="h-8 w-8 sm:h-9 sm:w-9"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
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
            <DialogTitle>Create Level</DialogTitle>
            <DialogDescription>Add a new level to a wing</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="wing" className="mb-2 block">
                  Wing <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.wing > 0 ? formData.wing.toString() : ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, wing: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select wing" />
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
                <Label className="mb-2 block">
                  Levels <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {LEVEL_OPTIONS.map((level) => (
                    <div
                      key={level.en}
                      className="flex items-center space-x-2 rounded-md border px-3 py-2 hover:bg-muted/30"
                    >
                      <Input
                        type="checkbox"
                        id={level.hi}
                        checked={formData.name.includes(level.hi)}
                        onChange={(e) => {
                          const newNames = e.target.checked
                            ? [...formData.name, level.hi]
                            : formData.name.filter((n) => n !== level.hi);
                          setFormData({ ...formData, name: newNames });
                        }}
                        className="h-4 w-4 accent-primary"
                      />
                      <Label
                        htmlFor={level.hi}
                        className="cursor-pointer text-sm"
                      >
                        {level.en}{" "}
                        <span className="text-muted-foreground ml-1">
                          ({level.hi})
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
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
                <Label htmlFor="edit-wing" className="mb-2 block">
                  Wing <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.wing > 0 ? formData.wing.toString() : ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, wing: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select wing" />
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
                <Label className="mb-2 block">
                  Levels <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {LEVEL_OPTIONS.map((level) => (
                    <div
                      key={level.en}
                      className="flex items-center space-x-2 rounded-md border px-3 py-2 hover:bg-muted/30"
                    >
                      <Input
                        type="checkbox"
                        id={`edit-${level.en}`}
                        checked={formData.name.includes(level.en)}
                        onChange={(e) => {
                          const newNames = e.target.checked
                            ? [...formData.name, level.en]
                            : formData.name.filter((n) => n !== level.en);
                          setFormData({ ...formData, name: newNames });
                        }}
                        className="h-4 w-4 accent-primary"
                      />
                      <Label
                        htmlFor={`edit-${level.en}`}
                        className="cursor-pointer text-sm"
                      >
                        {level.en}
                        <span className="text-muted-foreground ml-1">
                          ({level.hi})
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
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
              Are you sure you want to delete &quot;{currentLevel?.name}&quot;? This
              action cannot be undone.
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
