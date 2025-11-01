"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Heart,
  Facebook,
  Twitter,
  Youtube,
  Instagram,
} from "lucide-react";
import {
  quickLinks,
  importantLinks,
  offices,
  contactInfo,
  socialLinks,
  organizationInfo,
  FooterLink,
} from "./FooterData";

const Footer: React.FC = () => {
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />;
      case "twitter":
        return <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />;
      case "youtube":
        return <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />;
      case "instagram":
        return <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />;
      default:
        return <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  const renderFooterLink = (link: FooterLink) => {
    if (link.external) {
      return (
        <Link
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center gap-1 group text-xs sm:text-sm"
        >
          {link.label}
          <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      );
    }

    return (
      <Link
        href={link.href}
        className="text-gray-300 hover:text-orange-400 transition-colors duration-300 text-xs sm:text-sm"
      >
        {link.label}
      </Link>
    );
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                <Image
                  src={organizationInfo.logo}
                  alt={organizationInfo.name}
                  fill
                  className="object-contain rounded-lg"
                  sizes="(max-width: 640px) 48px, 64px"
                />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">
                  {organizationInfo.name}
                </h3>
                <p className="text-orange-400 text-xs sm:text-sm font-medium italic">
                  &ldquo;{organizationInfo.tagline}&rdquo;
                </p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed text-xs sm:text-sm max-w-2xl">
              {organizationInfo.description}
            </p>

            <div>
              <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                Follow Us
              </h4>
              <div className="flex gap-3 sm:gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 hover:bg-orange-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    aria-label={`Follow us on ${social.platform}`}
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <h4 className="text-base sm:text-lg md:text-xl font-semibold text-white border-b border-orange-600 pb-2 mb-4 sm:mb-6">
              Quick Links
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>{renderFooterLink(link)}</li>
              ))}
            </ul>

            <div className="pt-4 sm:pt-6">
              <h4 className="text-base sm:text-lg md:text-xl font-semibold text-white border-b border-orange-600 pb-2 mb-4 sm:mb-6">
                Important
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                {importantLinks.map((link, index) => (
                  <li key={index}>{renderFooterLink(link)}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <h4 className="text-base sm:text-lg md:text-xl font-semibold text-white border-b border-orange-600 pb-2 mb-4 sm:mb-6">
              Contact Us
            </h4>

            <div className="space-y-4 sm:space-y-6">
              {offices.map((office, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-white text-xs sm:text-sm mb-1">
                        {office.location}:
                      </h5>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                        {office.address}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 sm:space-y-3 pt-3 sm:pt-4 border-t border-gray-800">
              <div className="flex items-center gap-2 sm:gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                <Link
                  href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`}
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-300 text-xs sm:text-sm"
                >
                  {contactInfo.phone}
                </Link>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-300 text-xs sm:text-sm break-all"
                >
                  {contactInfo.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
              {organizationInfo.copyright}
            </p>

            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 fill-current" />
              <span>for Bharat</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
