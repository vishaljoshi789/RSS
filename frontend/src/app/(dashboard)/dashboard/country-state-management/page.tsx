"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, MapPin, Plus, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { useCountryApi } from "@/module/country/hooks";
import { toast } from "sonner";

export default function CountryStateManagementPage() {
  const {
    states,
    districts,
    isLoadingStates,
    isLoadingDistricts,
    statesError,
    districtsError,
    createState,
    createDistrict,
    isCreatingState,
    isCreatingDistrict,
    fetchStates,
    fetchDistricts,
    canCreateState,
    canCreateDistrict,
  } = useCountryApi();

  const [newStateName, setNewStateName] = useState("");
  const [newDistrictName, setNewDistrictName] = useState("");
  const [selectedStateForDistrict, setSelectedStateForDistrict] = useState<number | null>(null);
  const [isStateDialogOpen, setIsStateDialogOpen] = useState(false);
  const [isDistrictDialogOpen, setIsDistrictDialogOpen] = useState(false);

  const handleCreateState = async () => {
    if (!newStateName.trim()) {
      toast.error("Please enter a state name");
      return;
    }

    const result = await createState({ name: newStateName.trim() });
    if (result) {
      toast.success(`State "${result.name}" created successfully`);
      setNewStateName("");
      setIsStateDialogOpen(false);
      fetchStates();
    }
  };

  const handleCreateDistrict = async () => {
    if (!newDistrictName.trim()) {
      toast.error("Please enter a district name");
      return;
    }

    if (!selectedStateForDistrict) {
      toast.error("Please select a state");
      return;
    }

    const result = await createDistrict({
      name: newDistrictName.trim(),
      state: selectedStateForDistrict,
    });

    if (result) {
      toast.success(`District "${result.name}" created successfully`);
      setNewDistrictName("");
      setIsDistrictDialogOpen(false);
      fetchDistricts(selectedStateForDistrict);
    }
  };

  if (!canCreateState || !canCreateDistrict) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don&apos;t have permission to manage states and districts. Only admin and staff users can access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Globe className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Country, State & District Management</h1>
        </div>
        <p className="text-muted-foreground">
          Manage geographical locations for the organization. Add new states and districts as needed.
        </p>
      </div>

      {/* Permission Badge */}
      <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          You have admin/staff permissions to create and manage states and districts.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="states" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="states" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            States
          </TabsTrigger>
          <TabsTrigger value="districts" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Districts
          </TabsTrigger>
        </TabsList>

        {/* States Tab */}
        <TabsContent value="states" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>States</CardTitle>
                <CardDescription>
                  Manage all states in the system
                </CardDescription>
              </div>
              <Dialog open={isStateDialogOpen} onOpenChange={setIsStateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add State
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New State</DialogTitle>
                    <DialogDescription>
                      Create a new state in the system. Make sure the name is unique.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="state-name">State Name</Label>
                      <Input
                        id="state-name"
                        placeholder="e.g., Maharashtra"
                        value={newStateName}
                        onChange={(e) => setNewStateName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !isCreatingState) {
                            handleCreateState();
                          }
                        }}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsStateDialogOpen(false)}
                      disabled={isCreatingState}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateState}
                      disabled={isCreatingState || !newStateName.trim()}
                    >
                      {isCreatingState ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Create State
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {statesError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{statesError}</AlertDescription>
                </Alert>
              )}

              {isLoadingStates ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : states.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No states found. Add your first state to get started.</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>State Name</TableHead>
                        <TableHead className="w-[150px]">Districts</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {states.map((state) => (
                        <TableRow key={state.id}>
                          <TableCell className="font-medium">{state.id}</TableCell>
                          <TableCell>{state.name}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedStateForDistrict(state.id || null);
                                fetchDistricts(state.id);
                              }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>Total: {states.length} state(s)</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Districts Tab */}
        <TabsContent value="districts" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Districts</CardTitle>
                <CardDescription>
                  Manage districts within each state
                </CardDescription>
              </div>
              <Dialog open={isDistrictDialogOpen} onOpenChange={setIsDistrictDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add District
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New District</DialogTitle>
                    <DialogDescription>
                      Create a new district under a selected state.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="district-state">Select State</Label>
                      <Select
                        value={selectedStateForDistrict?.toString() || ""}
                        onValueChange={(value) => setSelectedStateForDistrict(Number(value))}
                      >
                        <SelectTrigger id="district-state">
                          <SelectValue placeholder="Choose a state" />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem key={state.id} value={state.id?.toString() || ""}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district-name">District Name</Label>
                      <Input
                        id="district-name"
                        placeholder="e.g., Mumbai"
                        value={newDistrictName}
                        onChange={(e) => setNewDistrictName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !isCreatingDistrict) {
                            handleCreateDistrict();
                          }
                        }}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDistrictDialogOpen(false)}
                      disabled={isCreatingDistrict}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateDistrict}
                      disabled={
                        isCreatingDistrict ||
                        !newDistrictName.trim() ||
                        !selectedStateForDistrict
                      }
                    >
                      {isCreatingDistrict ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Create District
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="filter-state">Filter by State</Label>
                <Select
                  value={selectedStateForDistrict?.toString() || "all"}
                  onValueChange={(value) => {
                    if (value === "all") {
                      setSelectedStateForDistrict(null);
                    } else {
                      const stateId = Number(value);
                      setSelectedStateForDistrict(stateId);
                      fetchDistricts(stateId);
                    }
                  }}
                >
                  <SelectTrigger id="filter-state" className="max-w-xs">
                    <SelectValue placeholder="All states" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {states.map((state) => (
                      <SelectItem key={state.id} value={state.id?.toString() || ""}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {districtsError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{districtsError}</AlertDescription>
                </Alert>
              )}

              {isLoadingDistricts ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : !selectedStateForDistrict ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a state to view its districts.</p>
                </div>
              ) : districts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No districts found for this state. Add your first district.</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>District Name</TableHead>
                        <TableHead>State</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {districts.map((district) => {
                        const stateName = states.find(
                          (s) => s.id === (district.state || district.state_id)
                        )?.name;
                        return (
                          <TableRow key={district.id}>
                            <TableCell className="font-medium">{district.id}</TableCell>
                            <TableCell>{district.name}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{stateName || "Unknown"}</Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}

              {selectedStateForDistrict && (
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>Total: {districts.length} district(s)</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
