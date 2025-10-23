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
import { UserMinus, Search, UserCheck } from "lucide-react";
import useAxios from "@/hooks/use-axios";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Position {
  id: number;
  pad: number;
  pad_name?: string;
  user?: User;
  is_filled: boolean;
}

interface Pad {
  id: number;
  name: string;
  level_name?: string;
  category_name?: string;
}

const VolunteerAssignment = () => {
  const axios = useAxios();
  const [positions, setPositions] = useState<Position[]>([]);
  const [pads, setPads] = useState<Pad[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isUnassignDialogOpen, setIsUnassignDialogOpen] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [selectedPad, setSelectedPad] = useState(0);
  const [selectedUser, setSelectedUser] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // TODO: Uncomment when API is ready
    // try {
    //   setLoading(true);
    //   const [positionsRes, padsRes, usersRes] = await Promise.all([
    //     axios.get("/volunteer/position/"),
    //     axios.get("/volunteer/pad/"),
    //     axios.get("/account/user/"),
    //   ]);
    //   setPositions(positionsRes.data.results || positionsRes.data || []);
    //   setPads(padsRes.data.results || padsRes.data || []);
    //   setUsers(usersRes.data.results || usersRes.data || []);
    // } catch (error: any) {
    //   toast.error(error.response?.data?.message || "Failed to fetch data");
    // } finally {
    //   setLoading(false);
    // }

    // Dummy data for now
    setLoading(true);
    setTimeout(() => {
      const dummyPads: Pad[] = [
        { id: 1, name: "Swayamsevak" },
        { id: 2, name: "Sahayak" },
        { id: 3, name: "Mukhya Shikshak" },
        { id: 4, name: "Zila Karyavah" },
        { id: 5, name: "Zila Pracharak" },
      ];
      const dummyUsers: User[] = [
        {
          id: 1,
          name: "Rajesh Kumar",
          email: "rajesh@example.com",
          phone: "+91 98765 43210",
        },
        {
          id: 2,
          name: "Amit Sharma",
          email: "amit@example.com",
          phone: "+91 98765 43211",
        },
        {
          id: 3,
          name: "Suresh Patil",
          email: "suresh@example.com",
          phone: "+91 98765 43212",
        },
        {
          id: 4,
          name: "Vikram Singh",
          email: "vikram@example.com",
          phone: "+91 98765 43213",
        },
        {
          id: 5,
          name: "Pradeep Joshi",
          email: "pradeep@example.com",
          phone: "+91 98765 43214",
        },
        {
          id: 6,
          name: "Ramesh Gupta",
          email: "ramesh@example.com",
          phone: "+91 98765 43215",
        },
        {
          id: 7,
          name: "Mahesh Verma",
          email: "mahesh@example.com",
          phone: "+91 98765 43216",
        },
        {
          id: 8,
          name: "Anil Kumar",
          email: "anil@example.com",
          phone: "+91 98765 43217",
        },
        {
          id: 9,
          name: "Deepak Rao",
          email: "deepak@example.com",
          phone: "+91 98765 43218",
        },
      ];
      const dummyPositions: Position[] = [
        {
          id: 1,
          pad: 1,
          user: dummyUsers[0],
          is_filled: true,
        },
        {
          id: 2,
          pad: 1,
          user: dummyUsers[1],
          is_filled: true,
        },
        {
          id: 3,
          pad: 1,
          user: dummyUsers[2],
          is_filled: true,
        },
        {
          id: 4,
          pad: 1,
          is_filled: false,
        },
        {
          id: 5,
          pad: 1,
          is_filled: false,
        },
        {
          id: 6,
          pad: 2,
          user: dummyUsers[3],
          is_filled: true,
        },
        {
          id: 7,
          pad: 2,
          user: dummyUsers[4],
          is_filled: true,
        },
        {
          id: 8,
          pad: 2,
          is_filled: false,
        },
        {
          id: 9,
          pad: 3,
          user: dummyUsers[5],
          is_filled: true,
        },
        {
          id: 10,
          pad: 3,
          is_filled: false,
        },
        {
          id: 11,
          pad: 4,
          user: dummyUsers[6],
          is_filled: true,
        },
        {
          id: 12,
          pad: 5,
          is_filled: false,
        },
        {
          id: 13,
          pad: 5,
          is_filled: false,
        },
      ];
      setPads(dummyPads);
      setUsers(dummyUsers);
      setPositions(dummyPositions);
      setLoading(false);
    }, 500);
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPosition) return;
    // TODO: Uncomment when API is ready
    // try {
    //   setSubmitting(true);
    //   await axios.put(`/volunteer/position/${currentPosition.id}/assign/`, {
    //     user: selectedUser,
    //   });
    //   toast.success("Volunteer assigned successfully");
    //   setIsAssignDialogOpen(false);
    //   setCurrentPosition(null);
    //   setSelectedUser(0);
    //   fetchData();
    // } catch (error: any) {
    //   toast.error(error.response?.data?.message || "Failed to assign volunteer");
    // } finally {
    //   setSubmitting(false);
    // }

    // Dummy implementation for now
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Volunteer assigned successfully");
      setIsAssignDialogOpen(false);
      setCurrentPosition(null);
      setSelectedUser(0);
      setSubmitting(false);
      fetchData();
    }, 500);
  };

  const handleUnassign = async () => {
    if (!currentPosition) return;
    // TODO: Uncomment when API is ready
    // try {
    //   setSubmitting(true);
    //   await axios.put(`/volunteer/position/${currentPosition.id}/unassign/`);
    //   toast.success("Volunteer unassigned successfully");
    //   setIsUnassignDialogOpen(false);
    //   setCurrentPosition(null);
    //   fetchData();
    // } catch (error: any) {
    //   toast.error(error.response?.data?.message || "Failed to unassign volunteer");
    // } finally {
    //   setSubmitting(false);
    // }

    // Dummy implementation for now
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Volunteer unassigned successfully");
      setIsUnassignDialogOpen(false);
      setCurrentPosition(null);
      setSubmitting(false);
      fetchData();
    }, 500);
  };

  const openAssignDialog = (position: Position) => {
    setCurrentPosition(position);
    setIsAssignDialogOpen(true);
  };

  const openUnassignDialog = (position: Position) => {
    setCurrentPosition(position);
    setIsUnassignDialogOpen(true);
  };

  const getPadName = (padId: number) => {
    return pads.find((p) => p.id === padId)?.name || "Unknown";
  };

  const filteredPositions = positions.filter((pos) => {
    const padName = getPadName(pos.pad).toLowerCase();
    const userName = pos.user?.name?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return padName.includes(search) || userName.includes(search);
  });

  const availableUsers = users.filter(
    (user) => !positions.some((p) => p.user?.id === user.id)
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Volunteer Assignments</CardTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by pad or volunteer name..."
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
                <TableHead>Position</TableHead>
                <TableHead>Pad (Designation)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Volunteer</TableHead>
                <TableHead>Contact</TableHead>
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
              ) : filteredPositions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No positions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPositions.map((position, index) => (
                  <TableRow key={position.id}>
                    <TableCell>
                      <Badge variant="outline">#{index + 1}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {getPadName(position.pad)}
                    </TableCell>
                    <TableCell>
                      {position.is_filled ? (
                        <Badge variant="default">Filled</Badge>
                      ) : (
                        <Badge variant="destructive">Vacant</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {position.user ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={position.user.email} />
                            <AvatarFallback>
                              {position.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{position.user.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {position.user ? (
                        <div className="text-sm">
                          <div>{position.user.email}</div>
                          <div className="text-muted-foreground">
                            {position.user.phone}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {position.is_filled ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openUnassignDialog(position)}
                        >
                          <UserMinus className="mr-2 h-4 w-4" />
                          Unassign
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openAssignDialog(position)}
                        >
                          <UserCheck className="mr-2 h-4 w-4" />
                          Assign
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Assign Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Volunteer</DialogTitle>
            <DialogDescription>
              Assign a volunteer to this position
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAssign}>
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Position</Label>
                <Input
                  value={currentPosition ? getPadName(currentPosition.pad) : ""}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div>
                <Label htmlFor="user" className="mb-2 block">
                  Select Volunteer <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedUser > 0 ? selectedUser.toString() : ""}
                  onValueChange={(value) => setSelectedUser(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select volunteer" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.length === 0 ? (
                      <SelectItem value="0" disabled>
                        No available volunteers
                      </SelectItem>
                    ) : (
                      availableUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name} - {user.email}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAssignDialogOpen(false);
                  setSelectedUser(0);
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || selectedUser === 0}>
                {submitting ? "Assigning..." : "Assign"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Unassign Dialog */}
      <Dialog open={isUnassignDialogOpen} onOpenChange={setIsUnassignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unassign Volunteer</DialogTitle>
            <DialogDescription>
              Are you sure you want to unassign {currentPosition?.user?.name} from
              this position?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUnassignDialogOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleUnassign}
              disabled={submitting}
            >
              {submitting ? "Unassigning..." : "Unassign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VolunteerAssignment;
