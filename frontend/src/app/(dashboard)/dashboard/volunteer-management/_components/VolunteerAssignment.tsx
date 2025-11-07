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
import {
  UserCheck,
  Users,
  Search,
  Filter,
  Eye,
  FileText,
  Phone,
  Calendar,
  Image,
  CreditCard,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import useAxios from "@/hooks/use-axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import UserProfileModel from "./userProfile";
import { createVolunteerAPI } from "@/module/dashboard/volunteer";

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
  const [selectedUserApplicationId, setSelectedUserApplicationId] = useState<
    number | null
  >(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    number | null
  >(null);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [detailsDialog, setDetailsDialog] = useState<boolean>(false);
  const [imageViewerOpen, setImageViewerOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const api = createVolunteerAPI(axios);

  const initialFetchDone = useRef(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (initialFetchDone.current) return;
    initialFetchDone.current = true;

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          wingsResponse,
          levelsResponse,
          designationsResponse,
          applicationsResponse,
        ] = await Promise.all([
          axios.get("/volunteer/wings/"),
          axios.get("/volunteer/levels/"),
          axios.get("/volunteer/designations/"),
          axios.get("/volunteer/applications/"),
        ]);

        setAllWings(wingsResponse.data.results || wingsResponse.data || []);
        setAllLevels(levelsResponse.data.results || levelsResponse.data || []);
        setAllDesignations(
          designationsResponse.data.results || designationsResponse.data || []
        );
        setApplications(
          applicationsResponse.data.results || applicationsResponse.data || []
        );
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

  const handleImageView = (imageUrl: string, imageTitle: string) => {
    setSelectedImage({ url: imageUrl, title: imageTitle });
    setImageViewerOpen(true);
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
                  <TableHead className="w-[180px]">Applicant Info</TableHead>
                  <TableHead className="w-[150px]">Wing</TableHead>
                  <TableHead className="w-[120px]">Level</TableHead>
                  <TableHead className="w-[150px]">Designation</TableHead>
                  <TableHead className="w-[120px]">Documents</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[120px]">Applied Date</TableHead>
                  <TableHead className="w-[200px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                        <p>Loading applications...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
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
                    <TableCell colSpan={8} className="text-center py-12">
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
                    const hasAadharFront = application.aadhar_card_front;
                    const hasAadharBack = application.aadhar_card_back;
                    const hasImage = application.image;
                    const documentsCount = [
                      hasAadharFront,
                      hasAadharBack,
                      hasImage,
                    ].filter(Boolean).length;

                    return (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {application.image ? (
                              <div className="relative">
                                <img
                                  src={application.image}
                                  alt="Profile"
                                  className="w-10 h-10 rounded-full object-cover border"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                <Users className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-sm">
                                {application.user_name ||
                                  `User ${application.user}`}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Phone className="h-3 w-3 mr-1" />
                                {application.phone_number || "No phone"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">
                            {application.wing_name || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {application.level_name || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">
                            {application.designation_title || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Badge variant="outline" className="text-xs">
                              {documentsCount}/3 docs
                            </Badge>
                            <div className="flex space-x-1">
                              {hasAadharFront && (
                                <div
                                  className="w-2 h-2 bg-green-500 rounded-full"
                                  title="Aadhar Front"
                                />
                              )}
                              {hasAadharBack && (
                                <div
                                  className="w-2 h-2 bg-green-500 rounded-full"
                                  title="Aadhar Back"
                                />
                              )}
                              {hasImage && (
                                <div
                                  className="w-2 h-2 bg-blue-500 rounded-full"
                                  title="Profile Image"
                                />
                              )}
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
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(
                              application.timestamp
                            ).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedApplication(application);
                                setDetailsDialog(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setUserModel(true);
                                setSelectedUserApplicationId(application.user);
                                setSelectedApplicationId(application.id);
                                setSelectedApplication(application);
                              }}
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Assign
                            </Button>
                          </div>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Volunteer Application Review
            </DialogTitle>
            <DialogDescription>
              Complete user profile and application details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  User Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UserProfileModel id={selectedUserApplicationId} />
              </CardContent>
            </Card>

            {selectedApplication && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Application Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Application ID
                        </label>
                        <p className="font-semibold">
                          {selectedApplication.id}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Wing
                        </label>
                        <p className="font-semibold">
                          {selectedApplication.wing_name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Level
                        </label>
                        <p className="font-semibold">
                          {selectedApplication.level_name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Designation
                        </label>
                        <p className="font-semibold">
                          {selectedApplication.designation_title || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Status
                        </label>
                        <div className="mt-1">
                          <Badge
                            variant={
                              selectedApplication.status === "approved"
                                ? "default"
                                : selectedApplication.status === "pending"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {selectedApplication.status}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Applied Date
                        </label>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {new Date(
                              selectedApplication.timestamp
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Phone Number
                        </label>
                        <div className="flex items-center mt-1">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {selectedApplication.phone_number || "N/A"}
                          </span>
                        </div>
                      </div>
                      {selectedApplication.remarks && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Remarks
                          </label>
                          <p className="text-sm bg-muted p-2 rounded mt-1">
                            {selectedApplication.remarks}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-base">
                      Submitted Documents
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Aadhar Card (Front)
                        </label>
                        {selectedApplication.aadhar_card_front ? (
                          <div 
                            className="relative group cursor-pointer"
                            onClick={() =>
                              handleImageView(
                                selectedApplication.aadhar_card_front,
                                "Aadhar Card (Front)"
                              )
                            }
                          >
                            <img
                              src={selectedApplication.aadhar_card_front}
                              alt="Aadhar Front"
                              className="w-full h-32 object-cover rounded border hover:opacity-75 transition-opacity"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black bg-opacity-60 rounded backdrop-blur-sm">
                              <div className="text-center text-white transform group-hover:scale-110 transition-transform duration-300">
                                <Eye className="h-8 w-8 mx-auto mb-2 drop-shadow-lg" />
                                <p className="text-sm font-medium">Click to View</p>
                              </div>
                            </div>
                            <Badge className="absolute top-2 right-2 bg-green-500">
                              ✓ Uploaded
                            </Badge>
                          </div>
                        ) : (
                          <div className="w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded flex items-center justify-center">
                            <div className="text-center">
                              <CreditCard className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Not uploaded
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Aadhar Card (Back)
                        </label>
                        {selectedApplication.aadhar_card_back ? (
                          <div 
                            className="relative group cursor-pointer"
                            onClick={() =>
                              handleImageView(
                                selectedApplication.aadhar_card_back,
                                "Aadhar Card (Back)"
                              )
                            }
                          >
                            <img
                              src={selectedApplication.aadhar_card_back}
                              alt="Aadhar Back"
                              className="w-full h-32 object-cover rounded border hover:opacity-75 transition-opacity"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black bg-opacity-60 rounded backdrop-blur-sm">
                              <div className="text-center text-white transform group-hover:scale-110 transition-transform duration-300">
                                <Eye className="h-8 w-8 mx-auto mb-2 drop-shadow-lg" />
                                <p className="text-sm font-medium">Click to View</p>
                              </div>
                            </div>
                            <Badge className="absolute top-2 right-2 bg-green-500">
                              ✓ Uploaded
                            </Badge>
                          </div>
                        ) : (
                          <div className="w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded flex items-center justify-center">
                            <div className="text-center">
                              <CreditCard className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Not uploaded
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Profile Image
                        </label>
                        {selectedApplication.image ? (
                          <div 
                            className="relative group cursor-pointer"
                            onClick={() =>
                              handleImageView(
                                selectedApplication.image,
                                "Profile Image"
                              )
                            }
                          >
                            <img
                              src={selectedApplication.image}
                              alt="Profile"
                              className="w-full h-32 object-cover rounded border hover:opacity-75 transition-opacity"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black bg-opacity-60 rounded backdrop-blur-sm">
                              <div className="text-center text-white transform group-hover:scale-110 transition-transform duration-300">
                                <Eye className="h-8 w-8 mx-auto mb-2 drop-shadow-lg" />
                                <p className="text-sm font-medium">Click to View</p>
                              </div>
                            </div>
                            <Badge className="absolute top-2 right-2 bg-blue-500">
                              ✓ Uploaded
                            </Badge>
                          </div>
                        ) : (
                          <div className="w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded flex items-center justify-center">
                            <div className="text-center">
                              <Image className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Not uploaded
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
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
                  await axios.put(
                    `/volunteer/applications/assign/${selectedApplicationId}/`
                  );
                  setUserModel(false);
                  const response = await axios.get("/volunteer/applications/");
                  setApplications(response.data.results || response.data || []);
                } catch (err) {
                  alert("Failed to assign as volunteer");
                }
              }}
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Assign as Volunteer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailsDialog} onOpenChange={setDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Application Details
            </DialogTitle>
            <DialogDescription>
              Complete information about the volunteer application
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      {selectedApplication.image ? (
                        <img
                          src={selectedApplication.image}
                          alt="Profile"
                          className="w-16 h-16 rounded-full object-cover border-2"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border-2">
                          <Users className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-md">
                          {selectedApplication.user_name ||
                            `User ${selectedApplication.user}`}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          ID: {selectedApplication.id}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">
                          {selectedApplication.phone_number ||
                            "No phone number"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">
                          Applied:{" "}
                          {new Date(
                            selectedApplication.timestamp
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Badge
                          variant={
                            selectedApplication.status === "approved"
                              ? "default"
                              : selectedApplication.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                          className="w-fit"
                        >
                          {selectedApplication.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      Position Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Wing
                      </label>
                      <p className="font-semibold">
                        {selectedApplication.wing_name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Level
                      </label>
                      <p className="font-semibold">
                        {selectedApplication.level_name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Designation
                      </label>
                      <p className="font-semibold">
                        {selectedApplication.designation_title || "N/A"}
                      </p>
                    </div>
                    {selectedApplication.remarks && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Remarks
                        </label>
                        <p className="text-sm bg-muted p-2 rounded">
                          {selectedApplication.remarks}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Submitted Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Aadhar Card (Front)
                      </label>
                      {selectedApplication.aadhar_card_front ? (
                        <div 
                          className="relative group cursor-pointer"
                          onClick={() =>
                            handleImageView(
                              selectedApplication.aadhar_card_front,
                              "Aadhar Card (Front)"
                            )
                          }
                        >
                          <img
                            src={selectedApplication.aadhar_card_front}
                            alt="Aadhar Front"
                            className="w-full h-32 object-cover rounded border hover:opacity-75 transition-opacity"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black bg-opacity-60 rounded backdrop-blur-sm">
                            <div className="text-center text-white transform group-hover:scale-110 transition-transform duration-300">
                              <Eye className="h-8 w-8 mx-auto mb-2 drop-shadow-lg" />
                              <p className="text-sm font-medium">Click to View</p>
                            </div>
                          </div>
                          <Badge className="absolute top-2 right-2 bg-green-500">
                            ✓ Uploaded
                          </Badge>
                        </div>
                      ) : (
                        <div className="w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded flex items-center justify-center">
                          <div className="text-center">
                            <CreditCard className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Not uploaded
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Aadhar Card (Back)
                      </label>
                      {selectedApplication.aadhar_card_back ? (
                        <div 
                          className="relative group cursor-pointer"
                          onClick={() =>
                            handleImageView(
                              selectedApplication.aadhar_card_back,
                              "Aadhar Card (Back)"
                            )
                          }
                        >
                          <img
                            src={selectedApplication.aadhar_card_back}
                            alt="Aadhar Back"
                            className="w-full h-32 object-cover rounded border hover:opacity-75 transition-opacity"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black bg-opacity-60 rounded backdrop-blur-sm">
                            <div className="text-center text-white transform group-hover:scale-110 transition-transform duration-300">
                              <Eye className="h-8 w-8 mx-auto mb-2 drop-shadow-lg" />
                              <p className="text-sm font-medium">Click to View</p>
                            </div>
                          </div>
                          <Badge className="absolute top-2 right-2 bg-green-500">
                            ✓ Uploaded
                          </Badge>
                        </div>
                      ) : (
                        <div className="w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded flex items-center justify-center">
                          <div className="text-center">
                            <CreditCard className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Not uploaded
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Profile Image
                      </label>
                      {selectedApplication.image ? (
                        <div 
                          className="relative group cursor-pointer"
                          onClick={() =>
                            handleImageView(
                              selectedApplication.image,
                              "Profile Image"
                            )
                          }
                        >
                          <img
                            src={selectedApplication.image}
                            alt="Profile"
                            className="w-full h-32 object-cover rounded border hover:opacity-75 transition-opacity"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black bg-opacity-60 rounded backdrop-blur-sm">
                            <div className="text-center text-white transform group-hover:scale-110 transition-transform duration-300">
                              <Eye className="h-8 w-8 mx-auto mb-2 drop-shadow-lg" />
                              <p className="text-sm font-medium">Click to View</p>
                            </div>
                          </div>
                          <Badge className="absolute top-2 right-2 bg-blue-500">
                            ✓ Uploaded
                          </Badge>
                        </div>
                      ) : (
                        <div className="w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded flex items-center justify-center">
                          <div className="text-center">
                            <Image className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Not uploaded
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            {selectedApplication && (
              <Button
                variant="default"
                onClick={async () => {
                  if (!selectedApplicationId) return;
                  try {
                    await axios.put(
                      `/volunteer/applications/assign/${selectedApplication.id}/`
                    );
                    setDetailsDialog(false);
                    const response = await axios.get(
                      "/volunteer/applications/"
                    );
                    setApplications(
                      response.data.results || response.data || []
                    );
                  } catch (err) {
                    alert("Failed to assign as volunteer");
                  }
                }}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Assign as Volunteer
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={imageViewerOpen} onOpenChange={setImageViewerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {selectedImage?.title || "Document Preview"}
            </DialogTitle>
            <DialogDescription>
              Click and drag to pan • Scroll to zoom • Right-click to save
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 pt-4">
            {selectedImage && (
              <div className="relative bg-gray-50 rounded-lg p-4 min-h-[400px] flex items-center justify-center">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="max-w-full max-h-[70vh] object-contain rounded shadow-lg cursor-zoom-in"
                  onClick={() => window.open(selectedImage.url, "_blank")}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDNIMy4wMSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjEuNSIvPgo8L3N2Zz4K";
                  }}
                />
                <div className="absolute top-2 right-2 space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => window.open(selectedImage.url, "_blank")}
                    className="bg-white/90 hover:bg-white shadow-md"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Open Full Size
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = selectedImage.url;
                      link.download = selectedImage.title
                        .replace(/\s+/g, "_")
                        .toLowerCase();
                      link.target = "_blank";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="bg-white/90 hover:bg-white shadow-md"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="p-6 pt-0">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VolunteerAssignment;
