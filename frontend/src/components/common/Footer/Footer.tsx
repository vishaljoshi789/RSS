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
        return <Facebook className="w-5 h-5" />;
      case "twitter":
        return <Twitter className="w-5 h-5" />;
      case "youtube":
        return <Youtube className="w-5 h-5" />;
      case "instagram":
        return <Instagram className="w-5 h-5" />;
      default:
        return <ExternalLink className="w-5 h-5" />;
    }
  };

  const renderFooterLink = (link: FooterLink) => {
    if (link.external) {
      return (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center gap-1 group"
        >
          {link.label}
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      );
    }

    return (
      <Link
        href={link.href}
        className="text-gray-300 hover:text-orange-400 transition-colors duration-300"
      >
        {link.label}
      </Link>
    );
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={organizationInfo.logo}
                  alt={organizationInfo.name}
                  fill
                  className="object-contain rounded-lg"
                  sizes="64px"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {organizationInfo.name}
                </h3>
                <p className="text-orange-400 text-sm font-medium italic">
                  &ldquo;{organizationInfo.tagline}&rdquo;
                </p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed text-sm max-w-2xl">
              {organizationInfo.description}
            </p>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-orange-500" />
                Follow Us
              </h4>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-orange-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    aria-label={`Follow us on ${social.platform}`}
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white border-b border-orange-600 pb-2 mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>{renderFooterLink(link)}</li>
              ))}
            </ul>

            <div className="pt-6">
              <h4 className="text-xl font-semibold text-white border-b border-orange-600 pb-2 mb-6">
                Important
              </h4>
              <ul className="space-y-3">
                {importantLinks.map((link, index) => (
                  <li key={index}>{renderFooterLink(link)}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white border-b border-orange-600 pb-2 mb-6">
              Contact Us
            </h4>

            <div className="space-y-6">
              {offices.map((office, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-white text-sm mb-1">
                        {office.location}:
                      </h5>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {office.address}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-800">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-500" />
                <a
                  href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`}
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-300"
                >
                  {contactInfo.phone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-500" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-300"
                >
                  {contactInfo.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              {organizationInfo.copyright}
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for Bharat</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
