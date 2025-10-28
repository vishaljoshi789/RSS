"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserCheck, Users, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import useAxios from "@/hooks/use-axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import UserProfileModel from "./userProfile";



const VolunteerAssignment = () => {
  
  const axios = useAxios();

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [allWings, setAllWings] = useState<any[]>([]);
  const [allLevels, setAllLevels] = useState<any[]>([]);
  const [allDesignations, setAllDesignations] = useState<any[]>([]);

  const [wingFilter, setWingFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [designationFilter, setDesignationFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userModel, setUserModel] = useState<boolean>(false);
  const [selectedUserApplicationId, setSelectedUserApplicationId] = useState<number | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);

  const initialFetchDone = useRef(false);
  const isInitialMount = useRef(true);

  
  useEffect(() => {
    if (initialFetchDone.current) return;
    initialFetchDone.current = true;

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        
        const [wingsResponse, levelsResponse, designationsResponse, applicationsResponse] = 
          await Promise.all([
            axios.get("/volunteer/wings/"),
            axios.get("/volunteer/levels/"),
            axios.get("/volunteer/designations/"),
            axios.get("/volunteer/applications/")
          ]);

        setAllWings(wingsResponse.data.results || wingsResponse.data || []);
        setAllLevels(levelsResponse.data.results || levelsResponse.data || []);
        setAllDesignations(designationsResponse.data.results || designationsResponse.data || []);
        setApplications(applicationsResponse.data.results || applicationsResponse.data || []);
      } catch (err: any) {
        console.error("Error fetching initial data:", err);
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
        isInitialMount.current = false;
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (isInitialMount.current) return;

    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (wingFilter !== "all") params.append("wing", wingFilter);
        if (levelFilter !== "all") params.append("level", levelFilter);
        if (designationFilter !== "all")
          params.append("designation", designationFilter);

        const url = `/volunteer/applications/${
          params.toString() ? `?${params.toString()}` : ""
        }`;
        const response = await axios.get(url);
        setApplications(response.data.results || response.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [wingFilter, levelFilter, designationFilter]);

  const filteredApplications = useMemo(() => {
    if (!searchTerm) return applications;

    return applications.filter((app) => {
      const searchLower = searchTerm.toLowerCase();

      return (
        app.wing_name?.toLowerCase().includes(searchLower) ||
        app.level_name?.toLowerCase().includes(searchLower) ||
        app.designation_title?.toLowerCase().includes(searchLower) ||
        app.user_name?.toLowerCase().includes(searchLower) ||
        app.phone_number?.toLowerCase().includes(searchLower) ||
        app.user?.toString().includes(searchLower)
      );
    });
  }, [applications, searchTerm]);

  const clearFilters = () => {
    setWingFilter("all");
    setLevelFilter("all");
    setDesignationFilter("all");
    setSearchTerm("");
  };

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Volunteer Applications
        </CardTitle>

        
        <div className="flex flex-wrap items-center gap-4 pt-4">
          
          <div className="relative min-w-[250px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          
          <Select value={wingFilter} onValueChange={setWingFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Wings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Wings</SelectItem>
              {allWings.map((wing: any) => (
                <SelectItem key={wing.id} value={wing.id.toString()}>
                  {wing.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {allLevels.map((level: any) => (
                <SelectItem key={level.id} value={level.id.toString()}>
                  {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          
          <Select
            value={designationFilter}
            onValueChange={setDesignationFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Designations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Designations</SelectItem>
              {allDesignations.map((designation: any) => (
                <SelectItem
                  key={designation.id}
                  value={designation.id.toString()}
                >
                  {designation.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          
          {(wingFilter !== "all" ||
            levelFilter !== "all" ||
            designationFilter !== "all" ||
            searchTerm) && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <Filter className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          )}

          
          <div className="text-sm text-muted-foreground ml-auto">
            Showing {filteredApplications.length} applications
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Wing</TableHead>
                <TableHead className="w-[150px]">Level</TableHead>
                <TableHead className="w-[200px]">Designation</TableHead>
                <TableHead className="w-[150px]">Applicant</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[120px]">Applied Date</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                      <p>Loading applications...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-destructive">
                      <Users className="h-12 w-12 mb-4 opacity-50" />
                      <h3 className="font-semibold text-lg mb-1">
                        Error Loading Data
                      </h3>
                      <p className="text-sm mb-4">{error}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.reload()}
                      >
                        Retry
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredApplications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Users className="h-12 w-12 mb-4 opacity-50" />
                      <h3 className="font-semibold text-lg mb-1">
                        No applications found
                      </h3>
                      <p className="text-sm mb-4">
                        {searchTerm ||
                        wingFilter !== "all" ||
                        levelFilter !== "all" ||
                        designationFilter !== "all"
                          ? "No applications match your current filters"
                          : "No applications available"}
                      </p>
                      {(searchTerm ||
                        wingFilter !== "all" ||
                        levelFilter !== "all" ||
                        designationFilter !== "all") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearFilters}
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplications.map((application) => {
                  return (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">
                            {application.wing_name || "N/A"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{application.level_name || "N/A"}</TableCell>
                      <TableCell className="font-medium">
                        {application.designation_title || "N/A"}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {application.user_name || `User ${application.user}`}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {application.phone_number || "No phone"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            application.status === "approved"
                              ? "default"
                              : application.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {application.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(application.timestamp).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setUserModel(true);
                            setSelectedUserApplicationId(application.user);
                            setSelectedApplicationId(application.id);
                          }}
                        >
                          <UserCheck className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <Dialog open={userModel} onOpenChange={setUserModel}>
      <DialogContent showCloseButton className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Complete information about the user
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <UserProfileModel id={selectedUserApplicationId} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="default"
            onClick={async () => {
              if (!selectedApplicationId) return;
              try {
                await axios.put(`/volunteer/applications/assign/${selectedApplicationId}/`);
                setUserModel(false);
                const response = await axios.get("/volunteer/applications/");
                setApplications(response.data.results || response.data || []);
              } catch (err) {
                alert("Failed to assign as volunteer");
              }
            }}
          >
            Assign as Volunteer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default VolunteerAssignment;
