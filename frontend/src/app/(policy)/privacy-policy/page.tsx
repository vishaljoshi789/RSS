import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Rashtriya Seva Sangh",
  description:
    "Learn how Rashtriya Seva Sangh collects, uses, and protects your personal information. Read our comprehensive privacy policy.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <nav className="mb-8 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Privacy Policy</span>
        </nav>

        
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: 01/06/2025
          </p>
        </div>

        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          
          <section>
            <p className="text-base leading-relaxed text-muted-foreground">
              Your privacy is important to us. It is Rashtriya Seva Sangh&apos;s
              policy to respect your privacy regarding any information we may
              collect from you across our website,{" "}
              <a
                href="http://joinrss.org.in"
                className="text-primary hover:underline"
              >
                http://joinrss.org.in
              </a>
              , and other sites we own and operate.
            </p>
          </section>

          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Information We Collect
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              We only collect information you provide directly to us. This may
              include personal information such as your name, address, email
              address, phone number, and donation details. We may also collect
              non-personal information like browser type, operating system, and
              website usage statistics.
            </p>
          </section>

          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              How We Use Your Information
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground mb-4">
              We may use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base text-muted-foreground">
              <li>Process and manage donations</li>
              <li>Send you donation confirmations and updates</li>
              <li>Respond to your inquiries</li>
              <li>Improve our website and user experience</li>
            </ul>
          </section>

          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Sharing Your Information
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              We do not share your personal information with third parties,
              except as required by law or to fulfill the purposes outlined in
              this Privacy Policy.
            </p>
          </section>

          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Cookies
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              We use cookies to enhance your experience on our website. You can
              choose to disable cookies through your browser settings, but this
              may affect the functionality of the site.
            </p>
          </section>

          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Security
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              We take reasonable measures to protect your personal information
              from unauthorized access or disclosure. However, no data
              transmission over the internet can be guaranteed as 100% secure.
            </p>
          </section>

          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Changes to This Privacy Policy
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              We may update our Privacy Policy from time to time. We will
              notify you of any changes by posting the new policy on this page.
            </p>
          </section>

          
          <section className="bg-muted/50 rounded-lg p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Contact Us
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground mb-2">
              If you have any questions about this Privacy Policy, please
              contact us at:
            </p>
            <a
              href="mailto:help@joinrss.org.in"
              className="text-primary hover:underline font-medium"
            >
              help@joinrss.org.in
            </a>
          </section>
        </div>

        
        <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4 justify-center text-sm">
          <Link
            href="/refund-policy"
            className="text-primary hover:underline font-medium"
          >
            Refund Policy
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link
            href="/terms-and-conditions"
            className="text-primary hover:underline font-medium"
          >
            Terms & Conditions
          </Link>
        </div>
      </div>
    </div>
  );
}
