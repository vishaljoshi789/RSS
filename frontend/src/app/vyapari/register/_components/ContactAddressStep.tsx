import { MapPin, Mail, Globe, Instagram, Facebook, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import useAxios from "@/hooks/use-axios";
import { toast } from "sonner";

interface ContactAddressStepProps {
  formData: {
    email: string;
    website_url: string;
    insta_url: string;
    facebook_url: string;
    referred_by: string;
    address_line1: string;
    address_line2: string;
    street: string;
    landmark: string;
    market: string;
    district: string;
    state: string;
    postal_code: string;
    latitude: string;
    longitude: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  emailVerified: boolean;
  setEmailVerified: (verified: boolean) => void;
  referralVerified: boolean;
  setReferralVerified: (verified: boolean) => void;
}

export function ContactAddressStep({
  formData,
  handleInputChange,
  emailVerified,
  setEmailVerified,
  referralVerified,
  setReferralVerified,
}: ContactAddressStepProps) {
  const axios = useAxios();
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [checkingReferral, setCheckingReferral] = useState(false);
  const [hasCheckedReferral, setHasCheckedReferral] = useState(false);

  const handleCheckEmail = async () => {
    if (!formData.email || !formData.email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setCheckingEmail(true);
    setHasChecked(true);
    setEmailVerified(false);

    try {
      const response = await axios.get(`/account/list/?email=${formData.email}`);
      
      if (response.data && response.data.results && response.data.results.length > 0) {
        setEmailVerified(true);
        toast.success("Email verified! This email is registered in the system.");
      } else {
        setEmailVerified(false);
        toast.error("Email not found. Please ensure you have registered as a user first.");
      }
    } catch (error: any) {
      console.error("Error checking email:", error);
      toast.error("Failed to verify email. Please try again.");
      setEmailVerified(false);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleCheckReferral = async () => {
    if (!formData.referred_by || !formData.referred_by.trim()) {
      toast.error("Please enter a referral user ID");
      return;
    }

    setCheckingReferral(true);
    setHasCheckedReferral(true);
    setReferralVerified(false);

    try {
      const userResponse = await axios.get(
        `/account/list/?user_id=${formData.referred_by.trim()}`
      );
      
      if (userResponse.data && userResponse.data.results && userResponse.data.results.length > 0) {
        const user = userResponse.data.results[0];
        setReferralVerified(true);
        toast.success(`Referral verified! Referred by: ${user.name || user.email || 'User'}`);
      } else {
        setReferralVerified(false);
        toast.error("Referral ID not found. Please check the user ID.");
      }
    } catch (error: any) {
      console.error("Error checking referral:", error);
      toast.error("Failed to verify referral. Please try again.");
      setReferralVerified(false);
    } finally {
      setCheckingReferral(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Contact & Address Information
        </h2>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground">
          Contact Details
        </h3>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  handleInputChange(e);
                  setEmailVerified(false);
                  setHasChecked(false); // Reset check status when email changes
                }}
                placeholder="your@email.com"
                className={`pl-10 ${
                  emailVerified
                    ? "border-green-500 focus-visible:ring-green-500"
                    : hasChecked && !emailVerified
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleCheckEmail}
              disabled={checkingEmail || !formData.email}
              className="px-6"
            >
              {checkingEmail ? "Checking..." : "Check"}
            </Button>
          </div>
          {emailVerified && (
            <p className="text-sm text-green-600">✓ Email verified successfully</p>
          )}
          {hasChecked && !emailVerified && (
            <p className="text-sm text-red-600">✗ Email not found in system</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="referred_by">
            Referred By (User ID) <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="referred_by"
                name="referred_by"
                value={formData.referred_by}
                onChange={(e) => {
                  handleInputChange(e);
                  setReferralVerified(false);
                  setHasCheckedReferral(false);
                }}
                placeholder="Enter referral user ID"
                className={`pl-10 ${
                  referralVerified
                    ? "border-green-500 focus-visible:ring-green-500"
                    : hasCheckedReferral && !referralVerified
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleCheckReferral}
              disabled={checkingReferral || !formData.referred_by}
              className="px-4 whitespace-nowrap"
            >
              {checkingReferral ? "Checking..." : "Check Referral"}
            </Button>
          </div>
          {referralVerified && (
            <p className="text-sm text-green-600">✓ Referral verified successfully</p>
          )}
          {hasCheckedReferral && !referralVerified && (
            <p className="text-sm text-red-600">✗ Referral ID not found</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="website_url">Website</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="website_url"
              name="website_url"
              value={formData.website_url}
              onChange={handleInputChange}
              placeholder="https://www.yourbusiness.com"
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="insta_url">Instagram</Label>
            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="insta_url"
                name="insta_url"
                value={formData.insta_url}
                onChange={handleInputChange}
                placeholder="https://instagram.com/..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebook_url">Facebook</Label>
            <div className="relative">
              <Facebook className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="facebook_url"
                name="facebook_url"
                value={formData.facebook_url}
                onChange={handleInputChange}
                placeholder="https://facebook.com/..."
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground">
          Address
        </h3>

        <div className="space-y-2">
          <Label htmlFor="address_line1">
            Address Line 1 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="address_line1"
            name="address_line1"
            value={formData.address_line1}
            onChange={handleInputChange}
            placeholder="House/Flat no., Building name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address_line2">Address Line 2</Label>
          <Input
            id="address_line2"
            name="address_line2"
            value={formData.address_line2}
            onChange={handleInputChange}
            placeholder="Area, Colony"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="street">Street</Label>
            <Input
              id="street"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              placeholder="Street name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="landmark">Landmark</Label>
            <Input
              id="landmark"
              name="landmark"
              value={formData.landmark}
              onChange={handleInputChange}
              placeholder="Near..."
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="market">
              Market <span className="text-destructive">*</span>
            </Label>
            <Input
              id="market"
              name="market"
              value={formData.market}
              onChange={handleInputChange}
              placeholder="Enter your market or city"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="district">District</Label>
            <Input
              id="district"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              placeholder="District"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="state">
              State <span className="text-destructive">*</span>
            </Label>
            <Input
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="State"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postal_code">Postal Code</Label>
            <Input
              id="postal_code"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleInputChange}
              placeholder="123456"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude (Optional)</Label>
            <Input
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              placeholder="e.g., 28.7041"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude (Optional)</Label>
            <Input
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              placeholder="e.g., 77.1025"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
