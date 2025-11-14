import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions - Rashtriya Seva Sangh",
  description:
    "Read the terms and conditions for using Rashtriya Seva Sangh Trust website and services.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Terms & Conditions</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Terms & Conditions
          </h1>
          <p className="text-lg text-muted-foreground">
            Rashtriya Seva Sangh Trust
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          {/* Introduction */}
          <section className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-6">
            <p className="text-base leading-relaxed text-muted-foreground">
              Welcome to Rashtriya Seva Sangh Trust. By accessing or using our
              website located at{" "}
              <a
                href="https://www.joinrss.org.in"
                className="text-primary hover:underline"
              >
                https://www.joinrss.org.in
              </a>
              , you agree to comply with and be bound by the following Terms and
              Conditions. If you do not agree to these terms, you must not use
              the Website.
            </p>
          </section>

          {/* 1. General Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              1. General Terms
            </h2>
            <div className="space-y-3">
              <p className="text-base leading-relaxed text-muted-foreground">
                <strong className="text-foreground">1.1.</strong> Rashtriya
                Seva Sangh is a registered trust dedicated to the protection of
                religion, society and culture.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                <strong className="text-foreground">1.2.</strong> These Terms
                and Conditions govern your use of the Website and all associated
                services provided by the Trust.
              </p>
            </div>
          </section>

          {/* 2. Use of the Website */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              2. Use of the Website
            </h2>
            <div className="space-y-3">
              <p className="text-base leading-relaxed text-muted-foreground">
                <strong className="text-foreground">2.1.</strong> You agree to
                use the Website only for lawful purposes and in a manner that
                does not infringe the rights of others or restrict or inhibit
                their use and enjoyment of the Website.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                <strong className="text-foreground">2.2.</strong> You must not
                misuse the Website by knowingly introducing viruses, malware, or
                any other harmful material.
              </p>
            </div>
          </section>

          {/* 3. Content and Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              3. Content and Intellectual Property
            </h2>
            <div className="space-y-3">
              <p className="text-base leading-relaxed text-muted-foreground">
                <strong className="text-foreground">3.1.</strong> All content on
                the Website, including text, images, graphics, logos, and other
                materials, is the property of Rashtriya Seva Sangh or its
                licensors and is protected by applicable copyright laws.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                <strong className="text-foreground">3.2.</strong> You may not
                reproduce, distribute, or modify any content from the Website
                without prior written consent from the Trust.
              </p>
            </div>
          </section>

          {/* 4. Donations and Payments */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              4. Donations and Payments
            </h2>
            <div className="space-y-3">
              <p className="text-base leading-relaxed text-muted-foreground">
                <strong className="text-foreground">4.1.</strong> The Website
                may allow users to make donations to support the Trust&apos;s
                initiatives. By making a donation, you agree to provide accurate
                and complete information.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                <strong className="text-foreground">4.2.</strong> Donations made
                to the Trust are{" "}
                <strong className="text-foreground">non-refundable</strong>,
                except in cases of technical errors or fraud, as determined by
                the Trust.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                <strong className="text-foreground">4.3.</strong> The Trust is
                not responsible for any additional charges or fees imposed by
                your bank or payment provider.
              </p>
            </div>
          </section>

          {/* 5. Third-Party Links */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              5. Third-Party Links
            </h2>
            <div className="space-y-3">
              <p className="text-base leading-relaxed text-muted-foreground">
                <strong className="text-foreground">5.1.</strong> The Website
                may contain links to third-party websites. Rashtriya Seva Sangh
                is not responsible for the content, accuracy, or practices of
                such websites.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                <strong className="text-foreground">5.2.</strong> The inclusion
                of any third-party link does not imply endorsement or approval
                by the Trust.
              </p>
            </div>
          </section>

          {/* 6. Privacy Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              6. Privacy Policy
            </h2>
            <div className="space-y-3">
              <p className="text-base leading-relaxed text-muted-foreground">
                <strong className="text-foreground">6.1.</strong> Your use of
                the Website is also governed by our{" "}
                <Link
                  href="/privacy-policy"
                  className="text-primary hover:underline"
                >
                  Privacy Policy
                </Link>
                , which is incorporated into these Terms and Conditions by
                reference.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                <strong className="text-foreground">6.2.</strong> By using the
                Website, you consent to the collection and use of your personal
                information as described in our Privacy Policy.
              </p>
            </div>
          </section>

          {/* 7. Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              7. Limitation of Liability
            </h2>
            <div className="space-y-3">
              <p className="text-base leading-relaxed text-muted-foreground">
                <strong className="text-foreground">7.1.</strong> Rashtriya Seva
                Sangh will not be liable for any loss or damage, including
                indirect or consequential losses, arising from your use of the
                Website or reliance on its content.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                <strong className="text-foreground">7.2.</strong> The Trust does
                not guarantee the accuracy or completeness of information
                provided on the Website.
              </p>
            </div>
          </section>

          {/* 8. Indemnity */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              8. Indemnity
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              You agree to indemnify and hold harmless Rashtriya Seva Sangh, its
              trustees, employees, and affiliates from and against any claims,
              liabilities, damages, or expenses arising out of your use of the
              Website or violation of these Terms and Conditions.
            </p>
          </section>

          {/* 9. Changes to Terms and Conditions */}
          <section className="bg-muted/50 rounded-lg p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              9. Changes to Terms and Conditions
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              The Trust reserves the right to update or modify these Terms and
              Conditions at any time without prior notice. Your continued use of
              the Website following any changes constitutes acceptance of the
              revised terms.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-primary/5 rounded-lg p-6 border border-primary/20">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Contact Information
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground mb-2">
              If you have any questions about these Terms and Conditions, please
              contact us at:
            </p>
            <a
              href="mailto:help@joinrss.org.in"
              className="text-primary hover:underline font-medium"
            >
              help@joinrss.org.in
            </a>
            <p className="text-base leading-relaxed text-muted-foreground mt-4">
              Website:{" "}
              <a
                href="https://www.joinrss.org.in"
                className="text-primary hover:underline"
              >
                https://www.joinrss.org.in
              </a>
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4 justify-center text-sm">
          <Link
            href="/privacy-policy"
            className="text-primary hover:underline font-medium"
          >
            Privacy Policy
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link
            href="/refund-policy"
            className="text-primary hover:underline font-medium"
          >
            Refund Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
