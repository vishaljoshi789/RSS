"use client";

import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Share2,
  Users,
  CheckCircle2,
  Gift,
} from "lucide-react";
import { toast } from "sonner";
import { User } from "@/types/auth.types";

interface ReferralModalProps {
  userData: User;
  referralCount: number;
}

export default function ReferralModal({ userData, referralCount }: ReferralModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const referralId = String(userData?.user_id || userData?.id || "N/A");

  const referralLink = useMemo(() => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL || "";
    return origin ? `${origin}/auth/register?ref=${referralId}` : "";
  }, [referralId]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(`${type} copied to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if(err instanceof Error){
        console.error(err)
        toast.error("Failed to copy to clipboard");
      }
    }
  };

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join RSS - RASHTRIYA SEVA SANGH",
          text: `Join me in RSS using my referral ID: ${referralId}`,
          url: referralLink,
        });
      } catch (error) {
        // User cancelled sharing or sharing failed
        if(error instanceof Error){
          console.error(error)
        }
        copyToClipboard(referralLink, "Referral link");
      }
    } else {
      copyToClipboard(referralLink, "Referral link");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={referralCount === 0 ? "default" : "outline"}
          size="sm" 
          className="gap-2"
        >
          <Gift className="h-4 w-4" />
          {referralCount === 0 ? "Start Referring" : "Share Referral"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-orange-600" />
            Invite Friends to RSS
          </DialogTitle>
          <DialogDescription>
            Share your referral ID with friends and family to help them join the RSS community.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Current Referrals</span>
              <Badge className="bg-orange-100 text-orange-800">
                {referralCount} People
              </Badge>
            </div>
            {referralCount === 0 ? (
              <p className="text-sm text-gray-500">
                You haven&apos;t referred anyone yet. Start sharing your referral ID!
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Great job! You&apos;ve helped {referralCount} people join RSS.
              </p>
            )}
          </div>

          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Your Referral ID
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 bg-gray-50 border rounded-lg font-mono text-center">
                  <span className="text-lg font-bold text-gray-900">{referralId}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(referralId, "Referral ID")}
                  className="gap-2"
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Referral Link
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 bg-gray-50 border rounded-lg">
                  <span className="text-sm text-gray-600 break-all">{referralLink}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(referralLink, "Referral link")}
                  className="gap-2"
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">How to refer someone:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Share your referral ID: <span className="font-mono font-bold">{referralId}</span></li>
              <li>2. Ask them to enter it during registration</li>
              <li>3. They&apos;ll be linked to you as their referrer</li>
              <li>4. Help them become active RSS members</li>
            </ol>
          </div>

          
          <div className="flex gap-2">
            <Button onClick={shareReferral} className="flex-1 gap-2">
              <Share2 className="h-4 w-4" />
              Share Referral
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}