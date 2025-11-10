"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

import {
  useDesignationsById,
  useLevelsById,
  useWings,
} from "@/module/dashboard/volunteer";
import { Wing, Level, Designation, ApplicationFormData } from "@/module/dashboard/volunteer/types";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

interface ApplicationFormProps {
  data: ApplicationFormData;
  setData: React.Dispatch<React.SetStateAction<ApplicationFormData>>;
  onNext: () => void;
  onBack?: () => void;
}

const ApplicationForm = ({
  data,
  setData,
  onNext,
  onBack,
}: ApplicationFormProps) => {
  const [selectedWingName, setSelectedWingName] = useState<string | null>(null);
  const [selectedWing, setSelectedWing] = useState<number | null>(null);
  const [selectedLevelName, setSelectedLevelName] = useState<string | null>(
    null
  );
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<number | null>(
    null
  );

  const { wings, loading: wingsLoading } = useWings();

  const { levels, loading: levelsLoading, fetchLevelsByWingId } = useLevelsById();

  const { designations, loading: designationsLoading, fetchDesignationsByIds } = useDesignationsById();

  const [aadharCardFront, setAadharCardFront] = useState<File | null>(null);
  const [aadharCardBack, setAadharCardBack] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const filteredLevels = levels || [];
  const filteredDesignations = designations || [];

  useEffect(() => {
    if (wings && data.wing) {
      const foundWing = wings.find((w) => w.id === data.wing);
      if (foundWing) {
        setSelectedWing(foundWing.id);
        setSelectedWingName(foundWing.name);
      }
    }
  }, [wings, data.wing]);

  useEffect(() => {
    if (levels && data.level) {
      const foundLevel = levels.find((l: Level) => l.id === data.level);
      if (foundLevel) {
        setSelectedLevel(foundLevel.id);
        setSelectedLevelName(foundLevel.name);
      }
    }
  }, [levels, data.level]);

  useEffect(() => {
    if (designations && data.designation) {
      const foundDesignation = designations.find(
        (d: Designation) => d.id === data.designation
      );
      if (foundDesignation) {
        setSelectedDesignation(foundDesignation.id);
      }
    }
  }, [designations, data.designation]);

  
  // Prevent redundant fetches on StrictMode double-invocation
  const fetchedWingRef = useRef<number | null>(null);
  useEffect(() => {
    if (selectedWing && fetchedWingRef.current !== selectedWing) {
      fetchedWingRef.current = selectedWing;
      fetchLevelsByWingId(selectedWing);
    }
  }, [selectedWing, fetchLevelsByWingId]);

  
  const fetchedDesignationKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (selectedWing && selectedLevel) {
      const key = `${selectedWing}:${selectedLevel}`;
      if (fetchedDesignationKeyRef.current !== key) {
        fetchedDesignationKeyRef.current = key;
        fetchDesignationsByIds(selectedWing, selectedLevel);
      }
    }
  }, [selectedWing, selectedLevel, fetchDesignationsByIds]);

  useEffect(() => {
    setSelectedLevelName(null);
    setSelectedLevel(null);
    setSelectedDesignation(null);
  }, [selectedWingName]);

  useEffect(() => {
    setSelectedDesignation(null);
  }, [selectedLevelName]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: keyof ApplicationFormData
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

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

      switch (fileType) {
        case "aadhar_card_front":
          setAadharCardFront(file);
          setData((prev) => ({ ...prev, aadhar_card_front: file }));
          break;
        case "aadhar_card_back":
          setAadharCardBack(file);
          setData((prev) => ({ ...prev, aadhar_card_back: file }));
          break;
        case "image":
          setImage(file);
          setData((prev) => ({ ...prev, image: file }));
          break;
      }
    }
  };

  const handleChange = (key: keyof ApplicationFormData, value: string | number | File | null) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setData((prev) => ({
      ...prev,
      wing: selectedWing,
      level: selectedLevel,
      level_name: selectedLevelName,
      designation: selectedDesignation,
    }));
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="grid gap-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="wing">Wing</Label>
              <Select
                value={selectedWingName || ""}
                onValueChange={(value) => {
                  setSelectedWingName(value);
                  const found = (wings || []).find((w: Wing) => w.name === value);
                  setSelectedWing(found?.id ?? null);
                }}
                disabled={wingsLoading}
              >
                <SelectTrigger id="wing">
                  <SelectValue placeholder="Select a wing" />
                </SelectTrigger>
                <SelectContent> 
                  {(wings || []).map((wing: Wing) => (
                    <SelectItem key={wing.id} value={wing.name}>
                      {wing.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="level">Level</Label>
              <Select
                value={
                  selectedLevelName && selectedLevel
                    ? `${selectedLevelName}__${selectedLevel}`
                    : ""
                }
                onValueChange={(value) => {
                  const [name, id] = String(value).split("__");
                  setSelectedLevelName(name || null);
                  setSelectedLevel(id ? Number(id) : null);
                }}
                disabled={!selectedWingName || levelsLoading}
              >
                <SelectTrigger id="level">
                  <SelectValue placeholder="Select a level" />
                </SelectTrigger>
                <SelectContent>
                  {filteredLevels.map((level: Level) => (
                    <SelectItem
                      key={`${level.id}-${level.name}`}
                      value={`${level.name}__${level.id}`}
                    >
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Designation and Phone Number in same row - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="designation">Designation</Label>
              <Select
                value={selectedDesignation?.toString() || ""}
                onValueChange={(value) => setSelectedDesignation(Number(value))}
                disabled={!selectedLevelName || designationsLoading}
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

            <div className="grid gap-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                type="tel"
                placeholder="Enter phone number"
                value={data.phone_number || ""}
                maxLength={10}
                onChange={(e) => handleChange("phone_number", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="referred_by_volunteer">
              Referred By <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="referred_by_volunteer"
              type="text"
              placeholder="Enter name or User ID of person who referred you"
              value={data.referred_by_volunteer || ""}
              onChange={(e) => handleChange("referred_by_volunteer", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              If someone referred you to join RSS, please enter their name or User ID here.
            </p>
          </div>

          <div className="grid gap-3">
            <Label>Uploads</Label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label className="text-sm font-medium">Aadhar Front *</Label>
                <Input
                  id="aadharFront"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "aadhar_card_front")}
                  className="cursor-pointer"
                  required
                />
                {aadharCardFront && (
                  <Badge variant="outline" className="gap-1">
                    <FileText className="h-3 w-3" /> {aadharCardFront.name}
                  </Badge>
                )}
                <p className="text-xs text-muted-foreground">
                  Upload Aadhar card front side (Image only) - Required
                </p>
              </div>

              <div className="grid gap-1">
                <Label className="text-sm font-medium">Aadhar Back *</Label>
                <Input
                  id="aadharBack"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "aadhar_card_back")}
                  className="cursor-pointer"
                  required
                />
                {aadharCardBack && (
                  <Badge variant="outline" className="gap-1">
                    <FileText className="h-3 w-3" /> {aadharCardBack.name}
                  </Badge>
                )}
                <p className="text-xs text-muted-foreground">
                  Upload Aadhar card back side (Image only) - Required
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Profile Photo *</Label>
                <div className="flex items-start flex-col gap-2">
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
                      <FileText className="h-3 w-3" /> {image.name}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload your profile photo (JPG, PNG, WEBP) - Required
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};

export default ApplicationForm;
