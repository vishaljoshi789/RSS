"use client";

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, ChevronDown, AlertCircle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCountryApi } from "../hooks";

// Types
interface SelectComponentProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  error?: string | null;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

interface SearchableSelectProps extends SelectComponentProps {
  items: Array<{ name: string; id?: number; code?: string }>;
  isLoading?: boolean;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
  showSearch?: boolean;
}

// Reusable Searchable Select Component
const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  placeholder = "Select an option",
  value,
  onValueChange,
  items = [],
  isLoading = false,
  error = null,
  required = false,
  disabled = false,
  className,
  onSearch,
  searchPlaceholder = "Search...",
  emptyMessage = "No options found",
  showSearch = true,
}) => {
  const [open, setOpen] = useState(false);

  // Safe items handling - filter out invalid items
  const safeItems = React.useMemo(() => {
    if (!Array.isArray(items)) {
      console.warn('SearchableSelect: items prop is not an array, defaulting to empty array');
      return [];
    }
    return items.filter(item => item && typeof item === 'object' && typeof item.name === 'string');
  }, [items]);

  const selectedItem = safeItems.find(
    (item) => item.name === value || item.id?.toString() === value
  );

  const handleSelect = (selectedValue: string) => {
    const item = safeItems.find(
      (item) => item.name === selectedValue || item.id?.toString() === selectedValue
    );
    if (item) {
      onValueChange?.(item.name);
      setOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label className="text-sm font-medium">
            {label} {required && <span className="text-destructive">*</span>}
          </Label>
        )}
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  // For simple selects without search (like country)
  if (!showSearch || safeItems.length <= 5) {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label className="text-sm font-medium">
            {label} {required && <span className="text-destructive">*</span>}
          </Label>
        )}
        
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
          <SelectTrigger className={cn(error && "border-destructive")}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {safeItems.length === 0 ? (
              <div className="py-4 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </div>
            ) : (
              safeItems.map((item, index) => (
                <SelectItem
                  key={item.id || item.name || index}
                  value={item.name}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="truncate">{item.name}</span>
                    {item.code && (
                      <Badge variant="secondary" className="text-xs">
                        {item.code}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {error && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  // For searchable selects (states, districts)
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="text-sm font-medium">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              error && "border-destructive",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <span className="truncate">
              {selectedItem ? selectedItem.name : placeholder}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              className="border-0 focus-visible:ring-0"
              onValueChange={onSearch}
            />
            
            <CommandList>
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </CommandEmpty>
              
              <CommandGroup>
                {safeItems.map((item, index) => (
                  <CommandItem
                    key={item.id || item.name || index}
                    value={item.name}
                    onSelect={handleSelect}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        (value === item.name || value === item.id?.toString())
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <span className="truncate">{item.name}</span>
                    {item.code && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {item.code}
                      </Badge>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

// Country Select Component
const CountrySelect: React.FC<SelectComponentProps> = ({
  label = "Country",
  placeholder = "Select country",
  value,
  onValueChange,
  error,
  required = false,
  disabled = false,
  className,
}) => {
  const { countries, isLoadingCountries, countriesError } = useCountryApi();

  // Handle potential API errors gracefully
  const safeError = error || countriesError;
  const safeCountries = Array.isArray(countries) ? countries : [];

  return (
    <SearchableSelect
      label={label}
      placeholder={placeholder}
      value={value}
      onValueChange={onValueChange}
      items={safeCountries}
      isLoading={isLoadingCountries}
      error={safeError}
      required={required}
      disabled={disabled}
      className={className}
      searchPlaceholder="Search countries..."
      emptyMessage="No countries available"
      showSearch={false}
    />
  );
};

// State Select Component
const StateSelect: React.FC<SelectComponentProps & { 
  countrySelected?: boolean;
  onStateSelect?: (stateName: string) => void;
  onStateChange?: (stateName: string, stateId?: number) => void;
  showCreateOption?: boolean;
  onCreateState?: (stateName: string) => Promise<void>;
}> = ({
  label = "State",
  placeholder = "Select state",
  value,
  onValueChange,
  error,
  required = false,
  disabled = false,
  className,
  countrySelected = true,
  onStateSelect,
  onStateChange,
  showCreateOption = false,
  onCreateState,
}) => {
  const {
    states,
    isLoadingStates,
    statesError,
    canCreateState,
    createState,
    fetchStates,
    resetStates,
  } = useCountryApi();

  const [isCreating, setIsCreating] = useState(false);
  const [newStateName, setNewStateName] = useState("");

  useEffect(() => {
    if (countrySelected) {
      fetchStates();
    } else {
      resetStates();
    }
  }, [countrySelected, fetchStates, resetStates]);

  const handleValueChange = (selectedValue: string) => {
    const selectedState = states.find(s => s.name === selectedValue);
    onValueChange?.(selectedValue);
    onStateSelect?.(selectedValue);
    onStateChange?.(selectedValue, selectedState?.id);
  };

  const handleCreateState = async () => {
    if (!newStateName.trim() || !canCreateState) return;
    
    setIsCreating(true);
    try {
      const newState = await createState({ name: newStateName.trim() });
      if (newState) {
        setNewStateName("");
        if (onCreateState) {
          await onCreateState(newState.name);
        }
        handleValueChange(newState.name);
      }
    } catch (error) {
      console.error('Failed to create state:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // Handle potential API errors gracefully
  const safeError = error || statesError;

  // Enhanced items with create option
  const enhancedItems = React.useMemo(() => {
    const safeStates = Array.isArray(states) ? states : [];
    const items = [...safeStates];
    
    if (showCreateOption && canCreateState && newStateName.trim()) {
      items.push({
        id: -1,
        name: `Create "${newStateName.trim()}"`,
        isCreateOption: true
      } as { id: number; name: string; isCreateOption?: boolean });
    }
    
    return items;
  }, [states, showCreateOption, canCreateState, newStateName]);

  if (!countrySelected) {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label className="text-sm font-medium text-muted-foreground">
            {label} {required && <span className="text-destructive">*</span>}
          </Label>
        )}
        <Button
          variant="outline"
          disabled
          className="w-full justify-start text-muted-foreground"
        >
          <MapPin className="mr-2 h-4 w-4" />
          Please select a country first
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <SearchableSelect
        label={label}
        placeholder={placeholder}
        value={value}
        onValueChange={(selectedValue) => {
          if (selectedValue.startsWith('Create "')) {
            handleCreateState();
          } else {
            handleValueChange(selectedValue);
          }
        }}
        items={enhancedItems}
        isLoading={isLoadingStates || isCreating}
        error={safeError}
        required={required}
        disabled={disabled || !countrySelected}
        searchPlaceholder="Search states..."
        emptyMessage="No states available"
        showSearch={true}
        onSearch={showCreateOption ? setNewStateName : undefined}
      />
      
      {showCreateOption && canCreateState && (
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>You can create new states as an admin/staff member</span>
          </div>
        </div>
      )}
      
      {showCreateOption && !canCreateState && (
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            <span>Only admin and staff can create new states</span>
          </div>
        </div>
      )}
    </div>
  );
};

// District Select Component
const DistrictSelect: React.FC<SelectComponentProps & {
  stateSelected?: boolean;
  selectedStateId?: number;
  selectedStateName?: string;
  showCreateOption?: boolean;
  onCreateDistrict?: (districtName: string) => Promise<void>;
}> = ({
  label = "District",
  placeholder = "Select district",
  value,
  onValueChange,
  error,
  required = false,
  disabled = false,
  className,
  stateSelected = false,
  selectedStateId,
  selectedStateName,
  showCreateOption = false,
  onCreateDistrict,
}) => {
  const {
    districts,
    isLoadingDistricts,
    districtsError,
    canCreateDistrict,
    createDistrict,
    fetchDistricts,
    resetDistricts,
  } = useCountryApi();

  const [isCreating, setIsCreating] = useState(false);
  const [newDistrictName, setNewDistrictName] = useState("");

  useEffect(() => {
    if (stateSelected && selectedStateId) {
      fetchDistricts(selectedStateId);
    } else {
      resetDistricts();
    }
  }, [stateSelected, selectedStateId, fetchDistricts, resetDistricts]);

  const handleCreateDistrict = async () => {
    if (!newDistrictName.trim() || !canCreateDistrict || !selectedStateId) return;
    
    setIsCreating(true);
    try {
      const newDistrict = await createDistrict({ 
        name: newDistrictName.trim(),
        state: selectedStateId 
      });
      if (newDistrict) {
        setNewDistrictName("");
        if (onCreateDistrict) {
          await onCreateDistrict(newDistrict.name);
        }
        onValueChange?.(newDistrict.name);
      }
    } catch (error) {
      console.error('Failed to create district:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // Handle potential API errors gracefully
  const safeError = error || districtsError;

  // Enhanced items with create option
  const enhancedItems = React.useMemo(() => {
    const safeDistricts = Array.isArray(districts) ? districts : [];
    const items = [...safeDistricts];
    
    if (showCreateOption && canCreateDistrict && newDistrictName.trim() && selectedStateId) {
      items.push({
        id: -1,
        name: `Create "${newDistrictName.trim()}"`,
        isCreateOption: true
      } as { id: number; name: string; state?: number; isCreateOption?: boolean });
    }
    
    return items;
  }, [districts, showCreateOption, canCreateDistrict, newDistrictName, selectedStateId]);

  if (!stateSelected) {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label className="text-sm font-medium text-muted-foreground">
            {label} {required && <span className="text-destructive">*</span>}
          </Label>
        )}
        <Button
          variant="outline"
          disabled
          className="w-full justify-start text-muted-foreground"
        >
          <MapPin className="mr-2 h-4 w-4" />
          Please select a state first
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <SearchableSelect
        label={label}
        placeholder={selectedStateName ? `Select district in ${selectedStateName}` : placeholder}
        value={value}
        onValueChange={(selectedValue) => {
          if (selectedValue.startsWith('Create "')) {
            handleCreateDistrict();
          } else {
            onValueChange?.(selectedValue);
          }
        }}
        items={enhancedItems}
        isLoading={isLoadingDistricts || isCreating}
        error={safeError}
        required={required}
        disabled={disabled || !stateSelected}
        searchPlaceholder="Search districts..."
        emptyMessage={stateSelected ? "No districts available" : "Please select a state first"}
        showSearch={true}
        onSearch={showCreateOption ? setNewDistrictName : undefined}
      />
      
      {showCreateOption && canCreateDistrict && selectedStateId && (
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>You can create new districts in {selectedStateName} as an admin/staff member</span>
          </div>
        </div>
      )}
      
      {showCreateOption && !canCreateDistrict && (
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            <span>Only admin and staff can create new districts</span>
          </div>
        </div>
      )}
      
      {showCreateOption && !selectedStateId && (
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>Select a state first to create districts</span>
          </div>
        </div>
      )}
    </div>
  );
};

export { 
  CountrySelect, 
  StateSelect, 
  DistrictSelect
};