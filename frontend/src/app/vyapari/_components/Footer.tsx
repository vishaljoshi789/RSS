import React from "react";
import Link from "next/link";
import { Store, Mail, Phone, MapPin } from "lucide-react";

const VyapariFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link href="/vyapari" className="flex items-center gap-2">
              <Store className="w-6 h-6 text-primary" />
              <div className="flex flex-col">
                <span className="font-bold text-base leading-tight">
                  व्यापारी पोर्टल
                </span>
                <span className="text-xs text-muted-foreground leading-tight">
                  Vyapari Portal
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              स्वदेशी व्यवसायों को बढ़ावा देने के लिए समर्पित मंच। अपने व्यवसाय
              को पंजीकृत करें और हमारे समुदाय से जुड़ें।
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/vyapari"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                href="/vyapari/businesses"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                All Businesses
              </Link>
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Back to Main Site
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Contact</h3>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:vyapari@joinrss.org.in"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>vyapari@joinrss.org.in</span>
              </a>
              <a
                href="tel:+919999999999"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+91 99999 99999</span>
              </a>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>राष्ट्रीय सेवा संघ, भारत</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              © {currentYear} राष्ट्रीय सेवा संघ - Vyapari Portal. All rights
              reserved.
            </p>
            <div className="flex gap-4">
              <Link
                href="/privacy-policy"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default VyapariFooter;
