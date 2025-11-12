"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ButtonRSS from "@/components/common/button-rss";
import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import MobileMenuButton from "./MobileMenuButton";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import { getUserImageUrl } from "@/lib/media";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <div className="h-20" />;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const userImageUrl = getUserImageUrl(user?.image);

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 h-[80px] pointer-events-auto"
      role="banner"
    >
      <div className="absolute inset-0 bg-background/95 backdrop-blur-md"></div>

      <div className="relative max-w-7xl mx-auto w-full h-20 px-1 sm:px-1 lg:px-4">
        <div className="flex items-stretch justify-between h-full">
          <div className="flex items-center justify-center relative">
            <Logo />
          </div>

          <div className="absolute left-[55%] top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden xl:block">
            <DesktopNav />
          </div>

          <div className="flex items-center justify-center relative ">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center p-3 gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-orange-500">
                      {userImageUrl && (
                        <AvatarImage
                          src={userImageUrl}
                          alt={user.name || "User"}
                        />
                      )}
                      <AvatarFallback className="bg-orange-500 text-white">
                        {user.name ? (
                          getUserInitials(user.name)
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm font-medium max-w-[150px] truncate">
                      {user.name || user.email}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="flex items-center cursor-pointer"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <ButtonRSS
                href="/auth/register"
                variant="primary"
                size="md"
                rounded="left-br"
                className="hidden lg:flex items-center gap-2 text-sm whitespace-nowrap font-medium transition-all duration-200 px-6"
              >
                <span>Join Now</span>
              </ButtonRSS>
            )}
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
