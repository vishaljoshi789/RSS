"use client";

import React, { useState } from "react";
import ButtonRSS from "@/components/common/button-rss";
import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import MobileMenuButton from "./MobileMenuButton";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 pointer-events-auto"
      role="banner"
    >
      <div className="absolute inset-0 bg-background/95 backdrop-blur-md"></div>

      <div className="relative max-w-7xl mx-auto w-full h-20 px-4 sm:px-6 lg:px-8">
        <div className="flex items-stretch justify-between h-full">
          <div className="flex items-center justify-center relative">
            <Logo />
          </div>

          <div className="absolute left-[55%] top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden xl:block">
            <DesktopNav />
          </div>

          <div className="flex items-center justify-center relative gap-4">
            <ButtonRSS
              href="/auth/register"
              variant="primary"
              size="md"
              rounded="left-br"
              className="hidden lg:flex items-center gap-2 text-sm whitespace-nowrap font-medium transition-all duration-200 px-6"
            >
              <span>Join Now</span>
            </ButtonRSS>
            <MobileMenuButton
              isOpen={isMobileMenuOpen}
              onToggle={toggleMobileMenu}
            />
          </div>
        </div>

        <MobileNav isOpen={isMobileMenuOpen} onMenuClose={closeMobileMenu} />
      </div>
    </header>
  );
};

export default Navbar;
