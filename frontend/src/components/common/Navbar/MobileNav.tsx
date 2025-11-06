'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { navigationItems } from './Navitems';
import MobileNavLink from './MobileNavLink';
import ButtonRSS from '@/components/common/button-rss';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LayoutDashboard, LogOut, User } from 'lucide-react';
import { getUserImageUrl } from '@/lib/media';

interface MobileNavProps {
  isOpen: boolean;
  onMenuClose: () => void;
}

const MobileNav = ({ isOpen, onMenuClose }: MobileNavProps) => {
  const { user, logout } = useAuth();
  const router = useRouter();

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
    onMenuClose();
    router.push("/");
  };

  const userImageUrl = getUserImageUrl(user?.image);
  return (
    <div 
      id="mobile-menu"
      className={`
        lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white/95 backdrop-blur-sm
        ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
      `}
      aria-hidden={!isOpen}
    >
      <div className="py-4 px-2 border-t border-primary/10 bg-gradient-to-b from-primary/5 to-background">
        <nav 
          className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto" 
          role="navigation" 
          aria-label="Mobile navigation"
        >
          {navigationItems.map((item) => (
            <MobileNavLink 
              key={item.id} 
              item={item} 
              onMenuClose={onMenuClose}
            />
          ))}
          
          <div className="pt-6 mt-6 border-t border-primary/10">
            {user ? (
              <div className="space-y-3">
                {/* User Info */}
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <Avatar className="h-12 w-12 border-2 border-orange-500">
                    {userImageUrl && (
                      <AvatarImage
                        src={userImageUrl}
                        alt={user.name || "User"}
                      />
                    )}
                    <AvatarFallback className="bg-orange-500 text-white">
                      {user.name ? getUserInitials(user.name) : <User className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Dashboard Link */}
                <Link
                  href="/dashboard"
                  onClick={onMenuClose}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors border border-transparent hover:border-orange-200"
                >
                  <LayoutDashboard className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors border border-transparent hover:border-red-200 text-red-600"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <ButtonRSS
                href="/auth/login"
                variant="primary"
                size="md"
                rounded="left-br"
                className="w-full text-center font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                aria-label="Join Rashtriya Seva Sangh - Register now"
              >
                Join Now
              </ButtonRSS>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MobileNav;