"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { EditUserDetailModal } from "@/module/dashboard/users/components/edit-user-detail-model";
import useAxios from "@/hooks/use-axios";


const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttarakhand","Uttar Pradesh","West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry"
];

export default function VolunteerTable() {
    const axios = useAxios();
  
  const [editing, setEditing] = useState<any | null>(null);
  const [openEditUser, setOpenEditUser] = useState(false);

  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialStates = (v: any) => v.states || [];

  const handleOpenEdit = (v: any) => {
    setEditing({ ...v, selectedStates: initialStates(v), can_view_member_data: !!v.can_view_member_data });
  };

  function updateVolunteer(id: number, data: any) {
    // use PATCH to update partial volunteer fields
    return axios.patch(`/volunteer/volunteers/${id}/`, data);
  }

  async function refetch() {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/volunteer/volunteers/');
      const list = res.data?.results ?? res.data ?? [];
      setVolunteers(list);
    } catch (err) {
      console.error(err);
      setError("Failed to load volunteers");
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    if (!editing) return;
    try {
      await updateVolunteer(editing.id, {
        can_view_member_data: editing.can_view_member_data,
        states: editing.selectedStates,
      } as any);
      setEditing(null);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserSave = async (userId: number, data: any) => {
    try {
      await axios.put(`/account/detail/${userId}/`, data);
      setOpenEditUser(false);
      // optionally refresh volunteers to pick up any change
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleState = (state: string) => {
    if (!editing) return;
    const set = new Set(editing.selectedStates || []);
    if (set.has(state)) set.delete(state);
    else set.add(state);
    setEditing({ ...editing, selectedStates: Array.from(set) });
  };

  const rows = useMemo(() => volunteers || [], [volunteers]);

  useEffect(() => {
    refetch();
  }, []);

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
            {rows.map((r: any) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    {r.user?.image ? <AvatarImage src={r.user.image} alt={r.user?.name} /> : <AvatarFallback>{(r.user?.name || r.user?.username || 'U').slice(0,2).toUpperCase()}</AvatarFallback>}
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{r.user?.name || r.user?.username}</span>
                    <span className="text-xs text-muted-foreground">{r.user?.profession}</span>
                  </div>
                </TableCell>
                <TableCell>{r.user?.email}</TableCell>
                <TableCell>{r.phone_number || r.user?.phone}</TableCell>
                <TableCell>{r.wing_name || '—'}</TableCell>
                <TableCell>{r.level_name || '—'}</TableCell>
                <TableCell>{r.designation_title || '—'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpenEdit(r)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editing} onOpenChange={(v) => { if (!v) setEditing(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Volunteer</DialogTitle>
          </DialogHeader>

          {editing && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  {editing.user?.image ? <AvatarImage src={editing.user.image} alt={editing.user?.name} /> : <AvatarFallback>{(editing.user?.name || editing.user?.username || 'U').slice(0,2).toUpperCase()}</AvatarFallback>}
                </Avatar>
                <div>
                  <div className="text-lg font-semibold">{editing.user?.name || editing.user?.username}</div>
                  <div className="text-sm text-muted-foreground">{editing.user?.email}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox checked={!!editing.can_view_member_data} onCheckedChange={(v:any) => setEditing({...editing, can_view_member_data: !!v})} />
                  <label className="text-sm">Can view member data</label>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">States</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">Select states</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72">
                      <div className="space-y-2 max-h-64 overflow-auto">
                        {INDIAN_STATES.map((s) => (
                          <div key={s} className="flex items-center gap-2">
                            <Checkbox checked={editing.selectedStates?.includes(s)} onCheckedChange={() => toggleState(s)} />
                            <span className="text-sm">{s}</span>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {(editing.selectedStates || []).map((st:string) => (
                      <Badge key={st}>{st}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  <Button onClick={() => setOpenEditUser(true)} variant="ghost">Edit user details</Button>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                  <Button onClick={handleSave}>Save</Button>
                </div>
              </div>

              {/* nested user edit modal */}
              <EditUserDetailModal user={editing.user} open={openEditUser} onOpenChange={setOpenEditUser} onSave={handleUserSave} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
