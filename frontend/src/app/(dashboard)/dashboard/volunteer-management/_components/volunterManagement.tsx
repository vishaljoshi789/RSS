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
import { useCountryApi } from "@/module/country/hooks";
import {
  StateSelect,
  DistrictSelect,
} from "@/module/country/components/country-select";

interface EditingVolunteer extends VolunteerWithUser {
  selectedStates: string[];
  can_view_member_data: boolean;
}

interface UpdateVolunteerData {
  can_view_member_data: boolean;
  states: string[];
}

export default function VolunteerTable() {
  const axios = useAxios();
  const { isAdmin, isStaff } = useAuth();
  const {
    states,
    isLoadingStates,
    isLoadingDistricts,
    statesError,
    districtsError,
    fetchStates,
    fetchDistricts,
  } = useCountryApi();

  const canCreateStateDistrict = isAdmin() || isStaff();

  const [editing, setEditing] = useState<EditingVolunteer | null>(null);
  const [openEditUser, setOpenEditUser] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [volunteerToDelete, setVolunteerToDelete] =
    useState<VolunteerWithUser | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedState, setSelectedState] = useState<string>("");

  const [volunteers, setVolunteers] = useState<VolunteerWithUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  useEffect(() => {
    if (selectedState) {
      const selectedStateItem = states.find((s) => s.name === selectedState);
      if (selectedStateItem?.id) {
        fetchDistricts(selectedStateItem.id);
      }
    }
  }, [selectedState, states, fetchDistricts]);

  const isDistrictLevel = useCallback(
    (levelName: string | undefined): boolean => {
      if (!levelName) return false;
      const levelNameLower = levelName.toLowerCase();
      const levelNameHindi = levelName;

      return (
        levelNameLower.includes("division") ||
        levelNameLower.includes("district") ||
        levelNameLower.includes("mandal") ||
        levelNameHindi.includes("संभाग") ||
        levelNameHindi.includes("मंडल") ||
        levelNameHindi.includes("जिला")
      );
    },
    []
  );

  const initialStates = (
    v: VolunteerWithUser & { states?: string[] }
  ): string[] => v.states || [];

  const handleOpenEdit = useCallback(
    (v: VolunteerWithUser & { states?: string[] }) => {
      setEditing({
        ...v,
        selectedStates: initialStates(v),
        can_view_member_data: !!v.can_view_member_data,
      } as EditingVolunteer);
    },
    []
  );

  const handleDeleteClick = useCallback((volunteer: VolunteerWithUser) => {
    setVolunteerToDelete(volunteer);
    setDeleteDialogOpen(true);
  }, []);

  const updateVolunteer = useCallback(
    (id: number, data: UpdateVolunteerData) => {
      return axios.patch(`/volunteer/volunteers/${id}/`, data);
    },
    [axios]
  );

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/volunteer/volunteers/");
      const list = res.data?.results ?? res.data ?? [];
      setVolunteers(list);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to fetch volunteers:", err);
      }
      setError("Failed to load volunteers");
    } finally {
      setLoading(false);
    }
  }, [axios]);

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

  const handleSave = useCallback(async () => {
    if (!editing) return;
    try {
      await updateVolunteer(editing.id, {
        can_view_member_data: editing.can_view_member_data,
        states: editing.selectedStates,
      });
      setEditing(null);
      await refetch();
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to save volunteer:", err);
      }
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

  const removeSelectedLocation = useCallback(
    (location: string) => {
      if (!editing) return;
      const updatedStates = (editing.selectedStates || []).filter(
        (s) => s !== location
      );
      setEditing({ ...editing, selectedStates: updatedStates });
    },
    [editing]
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
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Wing</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r: VolunteerWithUser) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
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
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {r.user?.name || r.user?.username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {r.user?.profession}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{r.user?.email}</TableCell>
                <TableCell>{r.phone_number || r.user?.phone}</TableCell>
                <TableCell>{r.wing_name || "—"}</TableCell>
                <TableCell>{r.level_name || "—"}</TableCell>
                <TableCell>{r.designation_title || "—"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleOpenEdit(r)}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteClick(r)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
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
            <div className="space-y-4">
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

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={!!editing.can_view_member_data}
                    onCheckedChange={(v: boolean) =>
                      setEditing({ ...editing, can_view_member_data: !!v })
                    }
                  />
                  <label className="text-sm">Can view member data</label>
                </div>

                <div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {isDistrictLevel(editing?.level_name)
                        ? "Locations (States/Districts)"
                        : "States"}
                    </label>

                    {/* Simple Select for State Level */}
                    {!isDistrictLevel(editing?.level_name) ? (
                      <div className="space-y-2">
                        <StateSelect
                          label=""
                          placeholder="Select states..."
                          value=""
                          onValueChange={(stateName) => {
                            if (
                              stateName &&
                              !editing.selectedStates?.includes(stateName)
                            ) {
                              setEditing({
                                ...editing,
                                selectedStates: [
                                  ...(editing.selectedStates || []),
                                  stateName,
                                ],
                              });
                            }
                          }}
                          error={statesError}
                          disabled={isLoadingStates}
                          showCreateOption={canCreateStateDistrict}
                          onCreateState={async (newStateName) => {
                            console.log("New state created:", newStateName);
                          }}
                        />
                      </div>
                    ) : (
                      /* District Level - Two Step Selection */
                      <div className="space-y-3 border rounded-lg p-3">
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground">
                            Step 1: Select State
                          </label>
                          <StateSelect
                            label=""
                            placeholder="Choose a state..."
                            value={selectedState}
                            onValueChange={setSelectedState}
                            error={statesError}
                            disabled={isLoadingStates}
                            showCreateOption={canCreateStateDistrict}
                            onCreateState={async (newStateName) => {
                              setSelectedState(newStateName);
                            }}
                          />
                        </div>

                        {selectedState && (
                          <div className="space-y-2 pt-2 border-t">
                            <label className="text-xs font-medium text-muted-foreground">
                              Step 2: Select Districts from {selectedState}
                            </label>
                            <DistrictSelect
                              label=""
                              placeholder="Select districts..."
                              value=""
                              onValueChange={(districtName) => {
                                if (
                                  districtName &&
                                  !editing.selectedStates?.includes(
                                    districtName
                                  )
                                ) {
                                  setEditing({
                                    ...editing,
                                    selectedStates: [
                                      ...(editing.selectedStates || []),
                                      districtName,
                                    ],
                                  });
                                }
                              }}
                              error={districtsError}
                              disabled={isLoadingDistricts}
                              stateSelected={!!selectedState}
                              selectedStateId={
                                states.find((s) => s.name === selectedState)?.id
                              }
                              selectedStateName={selectedState}
                              showCreateOption={canCreateStateDistrict}
                              onCreateDistrict={async (newDistrictName) => {
                                console.log(
                                  "New district created:",
                                  newDistrictName
                                );
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>{" "}
                  {(editing.selectedStates || []).length > 0 && (
                    <div className="border rounded-lg p-3 bg-muted/50 mt-2">
                      <div className="text-xs text-muted-foreground mb-2">
                        Selected{" "}
                        {isDistrictLevel(editing?.level_name)
                          ? "locations"
                          : "states"}{" "}
                        ({editing.selectedStates?.length || 0})
                      </div>
                      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                        {(editing.selectedStates || []).map(
                          (location: string) => (
                            <Badge
                              key={location}
                              variant="secondary"
                              className="flex items-center gap-1 pr-1 cursor-pointer hover:bg-destructive/20 transition-colors"
                            >
                              <span className="text-xs">{location}</span>
                              <button
                                type="button"
                                onClick={() => removeSelectedLocation(location)}
                                className="ml-1 rounded-full hover:bg-destructive/40 p-0.5 transition-colors"
                                aria-label={`Remove ${location}`}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  <Button onClick={() => setOpenEditUser(true)} variant="ghost">
                    Edit user details
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setEditing(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save</Button>
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
