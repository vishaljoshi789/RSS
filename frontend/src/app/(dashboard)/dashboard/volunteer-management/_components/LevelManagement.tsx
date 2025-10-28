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
import type { Level, LevelFormData } from "@/module/dashboard/volunteer";
import { toast } from "sonner";

const LevelManagement = () => {
  const { wings } = useWings();
  const { levels, loading, createLevel, updateLevel, deleteLevel } =
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
      toast.error("Failed to create level");
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
      // Error already handled by hook
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
    } catch (error) {
      // Error already handled by hook
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
                <TableHead>Wing</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                      <p>Loading levels...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredLevels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Layers className="h-12 w-12 mb-4 opacity-50" />
                      <h3 className="font-semibold text-lg mb-1">
                        No levels found
                      </h3>
                      <p className="text-sm mb-4">
                        {searchTerm
                          ? `No levels match "${searchTerm}"`
                          : "Create wings first, then add levels to organize them"}
                      </p>
                      {!searchTerm && wings.length > 0 && (
                        <Button
                          onClick={() => setIsCreateDialogOpen(true)}
                          size="sm"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Level
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLevels.map((level) => (
                  <TableRow key={level.id}>
                    <TableCell className="font-medium">
                      {Array.isArray(level.name)
                        ? level.name.join(", ")
                        : level.name}
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary">
                        {getWingName(level.wing)}
                      </Badge>
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
                        id={level.en}
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
                        htmlFor={level.en}
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
              Are you sure you want to delete "{currentLevel?.name}"? This
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
