"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, Upload, Loader2, FileText } from "lucide-react";
import {
  useWings,
  useLevels,
  useDesignations,
  createVolunteerAPI,
} from "@/module/dashboard/volunteer";
import { Wing, Level, Designation } from "@/module/dashboard/volunteer/types";
import useAxios from "@/hooks/use-axios";
import useAuth from "@/hooks/use-auth";
import { toast } from "sonner";

const CareersPage = () => {
  const axios = useAxios();
  const { user } = useAuth();
  const api = createVolunteerAPI(axios);

  const { wings, loading: wingsLoading } = useWings();
  const { levels, loading: levelsLoading } = useLevels();
  const { designations, loading: designationsLoading } = useDesignations();

  const [selectedWing, setSelectedWing] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<number | null>(
    null
  );
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [affidavit, setAffidavit] = useState<File | null>(null);
  const [aadharCardFront, setAadharCardFront] = useState<File | null>(null);
  const [aadharCardBack, setAadharCardBack] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const filteredLevels = selectedWing
    ? (levels || []).filter((level: Level) => level.wing === selectedWing)
    : [];

  const filteredDesignations = selectedLevel
    ? (designations || []).filter(
        (designation: Designation) => designation.level === selectedLevel
      )
    : [];

  useEffect(() => {
    setSelectedLevel(null);
    setSelectedDesignation(null);
  }, [selectedWing]);

  useEffect(() => {
    setSelectedDesignation(null);
  }, [selectedLevel]);

  const validatePdfFile = (file: File): boolean => {
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return false;
    }
    return true;
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: string
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (fileType !== "image" && !validatePdfFile(file)) {
        e.target.value = "";
        return;
      }

      if (fileType === "image") {
        const validImageTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];
        if (!validImageTypes.includes(file.type)) {
          toast.error("Only JPG, PNG, or WEBP images are allowed");
          e.target.value = "";
          return;
        }
      }

      switch (fileType) {
        case "affidavit":
          setAffidavit(file);
          break;
        case "aadharFront":
          setAadharCardFront(file);
          break;
        case "aadharBack":
          setAadharCardBack(file);
          break;
        case "image":
          setImage(file);
          break;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedWing || !selectedLevel || !selectedDesignation) {
      toast.error("Please select Wing, Level, and Designation");
      return;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number (minimum 10 digits)");
      return;
    }

    if (!affidavit) {
      toast.error("Affidavit is required");
      return;
    }

    if (!aadharCardFront) {
      toast.error("Aadhar Card Front is required");
      return;
    }

    if (!aadharCardBack) {
      toast.error("Aadhar Card Back is required");
      return;
    }

    if (!image) {
      toast.error("Profile Photo is required");
      return;
    }

    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    try {
      setSubmitting(true);

      await api.createApplication({
        user: user.id,
        wing: selectedWing,
        level: selectedLevel,
        designation: selectedDesignation,
        phone_number: phoneNumber,
        affidavit,
        aadhar_card_front: aadharCardFront,
        aadhar_card_back: aadharCardBack,
        image,
      });

      toast.success("Application submitted successfully");

      setSelectedWing(null);
      setSelectedLevel(null);
      setSelectedDesignation(null);
      setPhoneNumber("");
      setAffidavit(null);
      setAadharCardFront(null);
      setAadharCardBack(null);
      setImage(null);

      const fileInputs = ["affidavit", "aadharFront", "aadharBack", "image"];
      fileInputs.forEach((id) => {
        const input = document.getElementById(id) as HTMLInputElement;
        if (input) input.value = "";
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to submit application";
      toast.error(errorMessage);
      console.error("Failed to submit application:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Briefcase className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Volunteer Careers</h1>
          <p className="text-muted-foreground">Apply for volunteer positions</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Application Form */}
        <Card>
          <CardHeader>
            <CardTitle>Apply for a Position</CardTitle>
            <CardDescription>
              Select a position and submit your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Wing Selection */}
              <div className="space-y-2">
                <Label htmlFor="wing">Wing</Label>
                <Select
                  value={selectedWing?.toString() || ""}
                  onValueChange={(value) => setSelectedWing(Number(value))}
                  disabled={wingsLoading}
                >
                  <SelectTrigger id="wing">
                    <SelectValue placeholder="Select a wing" />
                  </SelectTrigger>
                  <SelectContent>
                    {(wings || []).map((wing: Wing) => (
                      <SelectItem key={wing.id} value={wing.id.toString()}>
                        {wing.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Level Selection */}
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select
                  value={selectedLevel?.toString() || ""}
                  onValueChange={(value) => setSelectedLevel(Number(value))}
                  disabled={!selectedWing || levelsLoading}
                >
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Select a level" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredLevels.map((level: Level) => (
                      <SelectItem key={level.id} value={level.id.toString()}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Designation Selection */}
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Select
                  value={selectedDesignation?.toString() || ""}
                  onValueChange={(value) =>
                    setSelectedDesignation(Number(value))
                  }
                  disabled={!selectedLevel || designationsLoading}
                >
                  <SelectTrigger id="designation">
                    <SelectValue placeholder="Select a designation" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredDesignations.map((designation: Designation) => (
                      <SelectItem
                        key={designation.id}
                        value={designation.id.toString()}
                      >
                        {designation.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  maxLength={15}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter a valid 10-15 digit phone number
                </p>
              </div>

              {/* Profile Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">Profile Photo *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => handleFileChange(e, "image")}
                    className="cursor-pointer"
                    required
                  />
                  {image && (
                    <Badge variant="outline" className="gap-1">
                      <FileText className="h-3 w-3" />
                      {image.name}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload your profile photo (JPG, PNG, WEBP) - Required
                </p>
              </div>

              {/* Affidavit Upload */}
              <div className="space-y-2">
                <Label htmlFor="affidavit">Affidavit *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="affidavit"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, "affidavit")}
                    className="cursor-pointer"
                    required
                  />
                  {affidavit && (
                    <Badge variant="outline" className="gap-1">
                      <FileText className="h-3 w-3" />
                      {affidavit.name}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload your affidavit document (PDF only) - Required
                </p>
              </div>

              {/* Aadhar Card Front Upload */}
              <div className="space-y-2">
                <Label htmlFor="aadharFront">
                  Aadhar Card Front *
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="aadharFront"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, "aadharFront")}
                    className="cursor-pointer"
                    required
                  />
                  {aadharCardFront && (
                    <Badge variant="outline" className="gap-1">
                      <FileText className="h-3 w-3" />
                      {aadharCardFront.name}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload Aadhar card front side (PDF only) - Required
                </p>
              </div>

              {/* Aadhar Card Back Upload */}
              <div className="space-y-2">
                <Label htmlFor="aadharBack">Aadhar Card Back *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="aadharBack"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, "aadharBack")}
                    className="cursor-pointer"
                    required
                  />
                  {aadharCardBack && (
                    <Badge variant="outline" className="gap-1">
                      <FileText className="h-3 w-3" />
                      {aadharCardBack.name}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload Aadhar card back side (PDF only) - Required
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={
                  submitting ||
                  !selectedWing ||
                  !selectedLevel ||
                  !selectedDesignation ||
                  !phoneNumber ||
                  !affidavit ||
                  !aadharCardFront ||
                  !aadharCardBack ||
                  !image
                }
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Application
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CareersPage;
