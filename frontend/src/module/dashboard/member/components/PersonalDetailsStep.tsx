import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type PersonalDetailsStepProps = {
  formData: {
    name: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    profession: string;
    referred_by?: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
};

const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const professionOptions = [
  { value: "student", label: "Student" },
  { value: "self-employed", label: "Self-employed" },
  { value: "professional", label: "Professional" },
  { value: "service", label: "Service / Job" },
  { value: "retired", label: "Retired" },
  { value: "other", label: "Other" },
];

export const PersonalDetailsStep = ({
  formData,
  errors,
  onChange,
}: PersonalDetailsStepProps) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Enter your name"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Date of birth</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.dob && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dob ? format(new Date(formData.dob), "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                captionLayout="dropdown"
                selected={formData.dob ? new Date(formData.dob) : undefined}
                onSelect={(date) => {
                  if (date) {
                    const age = calculateAge(date);
                    if (age < 18) {
                      toast.error("You must be at least 18 years old to register.");
                      return;
                    }
                    if (age > 100) {
                      toast.error("Please enter a valid date of birth.");
                      return;
                    }
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    onChange('dob', `${year}-${month}-${day}`);
                  }
                }}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.dob && (
            <p className="text-sm text-destructive">{errors.dob}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Gender</Label>
          <Select value={formData.gender} onValueChange={(value) => onChange("gender", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-sm text-destructive">{errors.gender}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Mobile number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="Enter your mobile number"
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Profession</Label>
        <Select
          value={formData.profession}
          onValueChange={(value) => onChange("profession", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {professionOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.profession && (
          <p className="text-sm text-destructive">{errors.profession}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="name@example.com"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="referred_by">
          Referral Code <span className="text-muted-foreground">(Optional)</span>
        </Label>
        <Input
          id="referred_by"
          type="text"
          value={formData.referred_by || ""}
          onChange={(e) => onChange("referred_by", e.target.value)}
          placeholder="Enter referral code if you have one"
        />
        {errors.referred_by && (
          <p className="text-sm text-destructive">{errors.referred_by}</p>
        )}
      </div>
    </div>
  );
};
