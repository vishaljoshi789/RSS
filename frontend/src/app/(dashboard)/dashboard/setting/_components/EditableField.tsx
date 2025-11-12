"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NotProvided } from "./NotProvided";
import { Check, X, Loader2 } from "lucide-react";

interface EditableFieldProps {
  label: string;
  name: string;
  value: string;
  type?: "text" | "date" | "select" | "textarea";
  options?: string[];
  isEditing: boolean;
  isLoading?: boolean;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (value: string) => void;
  className?: string;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  label,
  name,
  value,
  type = "text",
  options = [],
  isEditing,
  isLoading = false,
  required = false,
  disabled = false,
  placeholder,
  maxLength,
  onEdit,
  onSave,
  onCancel,
  onChange,
  className = "",
}) => {
  const hasValue = value && value.trim() !== "";

  const renderInput = () => {
    if (type === "select") {
      return (
        <Select value={value} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder || `Select ${label}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (type === "textarea") {
      return (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          disabled={disabled}
          rows={2}
        />
      );
    }

    return (
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        disabled={disabled}
        maxLength={maxLength}
        max={type === "date" ? new Date().toISOString().split("T")[0] : undefined}
      />
    );
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      {isEditing ? (
        <div className="space-y-2">
          {renderInput()}
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={onSave}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  Save
                </>
              )}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              <X className="w-3 h-3 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      ) : hasValue ? (
        <div
          onClick={disabled ? undefined : onEdit}
          className={`px-4 py-3 border rounded-lg bg-background ${
            disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-muted/50 hover:border-primary/50"
          } transition-all group`}
        >
          <p className="text-sm font-medium break-all">{value}</p>
        </div>
      ) : (
        <NotProvided 
          onClick={disabled ? undefined : onEdit}
          label={`Add ${label}`}
        />
      )}
    </div>
  );
};
