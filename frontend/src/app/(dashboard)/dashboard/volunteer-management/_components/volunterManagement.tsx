"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil, X, Trash2 } from "lucide-react";
import ErrorState from "@/components/status/ErrorState";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { EditUserDetailModal } from "@/module/dashboard/users/components/edit-user-detail-model";
import useAxios from "@/hooks/use-axios";
import { useAuth } from "@/hooks/use-auth";
import { VolunteerWithUser } from "@/module/dashboard/volunteer/types";
import { useVolunteersList } from "@/module/dashboard/volunteer/hooks";
import { useCountryApi } from "@/module/country/hooks";
import { toast } from "sonner";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface EditingVolunteer extends VolunteerWithUser {
  can_view_member_data: boolean;
}

interface UpdateVolunteerData {
  can_view_member_data: boolean;
}

export default function VolunteerTable() {
  const axios = useAxios();
  const { volunteers, loading, error, refetch } = useVolunteersList();
  const { states, isLoadingStates, fetchStates } = useCountryApi();

  const [editing, setEditing] = useState<EditingVolunteer | null>(null);
  const [editingOriginal, setEditingOriginal] = useState<{
    states: string[];
    can_view_member_data: boolean;
  } | null>(null);
  const [openEditUser, setOpenEditUser] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [volunteerToDelete, setVolunteerToDelete] =
    useState<VolunteerWithUser | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [isSavingAccess, setIsSavingAccess] = useState(false);

  const [waOpen, setWaOpen] = useState(false);
  const [waVolunteer, setWaVolunteer] = useState<VolunteerWithUser | null>(
    null
  );
  const [waStates, setWaStates] = useState<string[]>([]);
  const [waSaving, setWaSaving] = useState(false);
  const [waSelectOpen, setWaSelectOpen] = useState(false);

  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  const uniqueStates = useMemo(() => {
    const seen = new Set<string>();
    return states.filter((s) => {
      const n = s.name || String(s.id);
      if (seen.has(n)) return false;
      seen.add(n);
      return true;
    });
  }, [states]);

  const handleOpenEdit = useCallback((v: VolunteerWithUser) => {
    setEditing({
      ...v,
      can_view_member_data: !!v.can_view_member_data,
    } as EditingVolunteer);
    setEditingOriginal({
      states: v.working_areas || [],
      can_view_member_data: !!v.can_view_member_data,
    });
  }, []);

  const openWorkingAreas = useCallback((v: VolunteerWithUser) => {
    setWaVolunteer(v);
    setWaOpen(true);
    const initial = Array.from(
      new Set(
        (v.working_areas || []).map((name) => String(name)).filter(Boolean)
      )
    );
    setWaStates(initial as string[]);
  }, []);

  const saveWorkingAreas = useCallback(async () => {
    if (!waVolunteer || waStates.length === 0) return;
    setWaSaving(true);
    try {
      const payload = waStates.map((stateName) => ({
        volunteer: waVolunteer.id,
        area_name: stateName,
      }));
      const res = await axios.post("/volunteer/working-areas/", payload);
      if (res?.status && res.status >= 400) {
        throw new Error(`Server responded ${res.status}`);
      }
      toast.success("Working areas updated");
      setWaOpen(false);
      setWaVolunteer(null);
      setWaStates([]);
      await refetch();
    } catch (err: unknown) {
      console.error("Failed to save working areas:", err);
      toast.error("Failed to save working areas");
    } finally {
      setWaSaving(false);
    }
  }, [axios, waVolunteer, waStates, refetch]);

  const handleDeleteClick = useCallback((volunteer: VolunteerWithUser) => {
    setVolunteerToDelete(volunteer);
    setDeleteDialogOpen(true);
  }, []);

  const updateVolunteer = useCallback(
    (id: number, data: Partial<UpdateVolunteerData>) => {
      return axios.patch(`/volunteer/volunteers/${id}/`, data);
    },
    [axios]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!volunteerToDelete) return;

    try {
      setDeleting(true);
      await axios.delete(`/volunteer/volunteers/${volunteerToDelete.id}/`);
      setDeleteDialogOpen(false);
      setVolunteerToDelete(null);
      await refetch();
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to delete volunteer:", err);
      }
    } finally {
      setDeleting(false);
    }
  }, [volunteerToDelete, axios, refetch]);

  const accessChanged = useMemo(() => {
    if (!editing || !editingOriginal) return false;
    return (
      editing.can_view_member_data !== editingOriginal.can_view_member_data
    );
  }, [editing, editingOriginal]);

  const saveAccess = useCallback(async () => {
    if (!editing) return;
    setIsSavingAccess(true);
    try {
      await updateVolunteer(editing.id, {
        can_view_member_data: editing.can_view_member_data,
      });
      toast.success("Access privileges updated");
      setEditingOriginal((prev) =>
        prev
          ? { ...prev, can_view_member_data: editing.can_view_member_data }
          : prev
      );
      await refetch();
    } catch (err) {
      console.error("Failed to update access:", err);
      toast.error("Failed to update access");
    } finally {
      setIsSavingAccess(false);
    }
  }, [editing, updateVolunteer, refetch]);

  const handleUserSave = useCallback(
    async (userId: number, data: Record<string, unknown>) => {
      try {
        await axios.put(`/account/detail/${userId}/`, data);
        setOpenEditUser(false);
        await refetch();
      } catch (err) {
        if (err instanceof Error) {
          console.error("Failed to update user:", err);
        }
      }
    },
    [axios, refetch]
  );

  const rows = useMemo(() => volunteers || [], [volunteers]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading volunteers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Error loading volunteers"
        message={error}
        onRetry={refetch}
        className="p-8"
      />
    );
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm">ID</TableHead>
              <TableHead className="text-xs sm:text-sm">Name</TableHead>
              <TableHead className="hidden md:table-cell text-xs sm:text-sm">
                Email
              </TableHead>
              <TableHead className="hidden sm:table-cell text-xs sm:text-sm">
                Phone
              </TableHead>
              <TableHead className="hidden lg:table-cell text-xs sm:text-sm">
                Wing
              </TableHead>
              <TableHead className="hidden lg:table-cell text-xs sm:text-sm">
                Level
              </TableHead>
              <TableHead className="hidden md:table-cell text-xs sm:text-sm">
                Designation
              </TableHead>
              <TableHead className="text-xs sm:text-sm">States</TableHead>
              <TableHead className="text-xs sm:text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r: VolunteerWithUser) => (
              <TableRow key={r.id}>
                <TableCell className="text-xs sm:text-sm">{r.id}</TableCell>
                <TableCell className="text-xs sm:text-sm">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
                      {r.user?.image ? (
                        <AvatarImage src={r.user.image} alt={r.user?.name} />
                      ) : (
                        <AvatarFallback>
                          {(r.user?.name || r.user?.username || "U")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium truncate">
                        {r.user?.name || r.user?.username}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {r.user?.profession}
                      </span>
                      <div className="sm:hidden mt-1 space-y-0.5 text-xs text-muted-foreground">
                        <div className="md:hidden">{r.user?.email}</div>
                        <div className="sm:hidden">
                          {r.phone_number || r.user?.phone}
                        </div>
                        <div className="lg:hidden">
                          {r.wing_name || "—"} • {r.level_name || "—"}
                        </div>
                        <div className="md:hidden">
                          {r.designation_title || "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                  {r.user?.email}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                  {r.phone_number || r.user?.phone}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-xs sm:text-sm">
                  {r.wing_name || "—"}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-xs sm:text-sm">
                  {r.level_name || "—"}
                </TableCell>
                <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                  {r.designation_title || "—"}
                </TableCell>
                <TableCell className="text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {r.working_areas.length}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openWorkingAreas(r)}
                    >
                      Manage
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleOpenEdit(r)}
                      title="Edit"
                      className="h-8 w-8 sm:h-9 sm:w-9"
                    >
                      <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteClick(r)}
                      title="Delete"
                      className="h-8 w-8 sm:h-9 sm:w-9"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!editing}
        onOpenChange={(v) => {
          if (!v) setEditing(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Volunteer</DialogTitle>
          </DialogHeader>

          {editing && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  {editing.user?.image ? (
                    <AvatarImage
                      src={editing.user.image}
                      alt={editing.user?.name}
                    />
                  ) : (
                    <AvatarFallback>
                      {(editing.user?.name || editing.user?.username || "U")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <div className="text-lg font-semibold">
                    {editing.user?.name || editing.user?.username}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {editing.user?.email}
                  </div>
                </div>
              </div>

              {/* Section 1: Access Privileges */}
              <div className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Access Privileges
                  </label>
                  <Button
                    size="sm"
                    onClick={saveAccess}
                    disabled={!accessChanged || isSavingAccess}
                  >
                    {isSavingAccess ? "Saving..." : "Confirm access change"}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={!!editing.can_view_member_data}
                    onCheckedChange={(v: boolean) =>
                      setEditing({ ...editing, can_view_member_data: !!v })
                    }
                  />
                  <label className="text-sm">Can view member data</label>
                </div>
              </div>

              {/* Locations moved to dedicated Working Areas modal */}

              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  <Button onClick={() => setOpenEditUser(true)} variant="ghost">
                    Edit user details
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setEditing(null)}>
                    Close
                  </Button>
                </div>
              </div>

              <EditUserDetailModal
                user={editing.user}
                open={openEditUser}
                onOpenChange={setOpenEditUser}
                onSave={handleUserSave}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Working Areas Modal */}
      <Dialog
        open={waOpen}
        onOpenChange={(v) => {
          setWaOpen(v);
          if (!v) {
            setWaVolunteer(null);
          }
        }}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Manage Working Areas</DialogTitle>
            <DialogDescription>
              Select states where this volunteer will work.
            </DialogDescription>
          </DialogHeader>

          {waVolunteer && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  {waVolunteer.user?.image ? (
                    <AvatarImage
                      src={waVolunteer.user.image}
                      alt={waVolunteer.user?.name}
                    />
                  ) : (
                    <AvatarFallback>
                      {(
                        waVolunteer.user?.name ||
                        waVolunteer.user?.username ||
                        "U"
                      )
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <div className="font-semibold">
                    {waVolunteer.user?.name || waVolunteer.user?.username}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {waVolunteer.user?.email}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Popover open={waSelectOpen} onOpenChange={setWaSelectOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <span>Select States</span>
                      <span className="text-xs text-muted-foreground">
                        {waStates.length} selected
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-3" align="start">
                    <div className="text-xs font-medium mb-2">States</div>
                    <div className="max-h-56 overflow-y-auto space-y-1">
                      {isLoadingStates ? (
                        <div className="text-xs text-muted-foreground p-2">
                          Loading...
                        </div>
                      ) : (
                        uniqueStates.map((s, idx) => {
                          const checked = waStates.includes(s.name);
                          return (
                            <label
                              key={(s.id ?? s.name) + "_" + idx}
                              className="flex items-center gap-2 px-1 py-1 rounded hover:bg-muted cursor-pointer text-sm"
                              onClick={(e) => {
                                e.preventDefault();
                                setWaStates((prev) =>
                                  checked
                                    ? prev.filter((v) => v !== s.name)
                                    : [...prev, s.name]
                                );
                              }}
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(val) => {
                                  setWaStates((prev) =>
                                    val
                                      ? [...prev, s.name]
                                      : prev.filter((v) => v !== s.name)
                                  );
                                }}
                              />
                              <span className="truncate">{s.name}</span>
                            </label>
                          );
                        })
                      )}
                    </div>
                    <div className="pt-2 flex justify-end">
                      <Button size="sm" onClick={() => setWaSelectOpen(false)}>
                        Done
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <div className="border rounded-lg p-3 bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-2">
                    Selected states ({waStates.length})
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                    {waStates.map((st) => (
                      <Badge
                        key={st}
                        variant="secondary"
                        className="flex items-center gap-1 pr-1"
                      >
                        <span className="text-xs">{st}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setWaStates((prev) => prev.filter((s) => s !== st))
                          }
                          className="ml-1 rounded-full hover:bg-destructive/40 p-0.5"
                          aria-label={`Remove ${st}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {waStates.length === 0 && (
                      <div className="text-xs text-muted-foreground">
                        No states selected.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setWaOpen(false);
                    setWaVolunteer(null);
                  }}
                  disabled={waSaving}
                >
                  Close
                </Button>
                <Button
                  onClick={saveWorkingAreas}
                  disabled={waSaving}
                >
                  {waSaving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Volunteer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this volunteer? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          {volunteerToDelete && (
            <div className="flex items-center gap-4 py-4 border rounded-lg p-4">
              <Avatar className="h-12 w-12">
                {volunteerToDelete.user?.image ? (
                  <AvatarImage
                    src={volunteerToDelete.user.image}
                    alt={volunteerToDelete.user.name}
                  />
                ) : (
                  <AvatarFallback>
                    {(
                      volunteerToDelete.user.name ||
                      volunteerToDelete.user.username ||
                      "U"
                    )
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold">
                  {volunteerToDelete.user.name ||
                    volunteerToDelete.user.username}
                </div>
                <div className="text-sm text-muted-foreground">
                  {volunteerToDelete.user.email}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {volunteerToDelete.wing_name} • {volunteerToDelete.level_name}{" "}
                  • {volunteerToDelete.designation_title}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
