"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Menu, X, Store, Home, LogOut, LayoutDashboard } from "lucide-react";
import ButtonRSS from "@/components/common/button-rss";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserImageUrl } from "@/lib/media";

const VyapariHeader = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (!hasMounted) {
    return <div className="h-16" />;
  }

  const userImageUrl = getUserImageUrl(user?.image);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/vyapari"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Store className="w-8 h-8 text-primary" />
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">
                व्यापारी पोर्टल
              </span>
              <span className="text-xs text-muted-foreground leading-tight">
                Vyapari Portal
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/vyapari"
              className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              href="/vyapari/businesses"
              className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
            >
              <Store className="w-4 h-4" />
              All Businesses
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-hidden">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors">
                    <Avatar className="w-8 h-8">
                      {userImageUrl && (
                        <AvatarImage src={userImageUrl} alt={user.name} />
                      )}
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    variant="destructive"
                    className="cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <ButtonRSS
                  href="/auth/login"
                  variant="outline"
                  size="sm"
                  className="text-sm"
                >
                  Login
                </ButtonRSS>
                <ButtonRSS
                  href="/auth/register"
                  variant="primary"
                  size="sm"
                  className="text-sm"
                >
                  Sign Up
                </ButtonRSS>
              </>
            )}
          </div>

          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link
                href="/vyapari"
                onClick={closeMobileMenu}
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors py-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link
                href="/vyapari/businesses"
                onClick={closeMobileMenu}
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors py-2"
              >
                <Store className="w-4 h-4" />
                All Businesses
              </Link>

              <div className="pt-4 border-t border-border flex flex-col gap-3">
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-2">
                      <Avatar className="w-10 h-10">
                        {userImageUrl && (
                          <AvatarImage src={userImageUrl} alt={user.name} />
                        )}
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getUserInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-destructive/10 transition-colors text-sm font-medium text-destructive text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <ButtonRSS
                      href="/auth/login"
                      variant="outline"
                      size="sm"
                      className="w-full text-sm"
                      onClick={closeMobileMenu}
                    >
                      Login
                    </ButtonRSS>
                    <ButtonRSS
                      href="/auth/register"
                      variant="primary"
                      size="sm"
                      className="w-full text-sm"
                      onClick={closeMobileMenu}
                    >
                      Sign Up
                    </ButtonRSS>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default VyapariHeader;
