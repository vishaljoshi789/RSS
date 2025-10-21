import React from 'react';
import { navigationItems } from './Navitems';
import MobileNavLink from './MobileNavLink';
import ButtonRSS from '@/components/common/button-rss';

interface MobileNavProps {
  isOpen: boolean;
  onMenuClose: () => void;
}

const MobileNav = ({ isOpen, onMenuClose }: MobileNavProps) => {
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
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MobileNav;