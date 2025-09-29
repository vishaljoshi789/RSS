import React from 'react';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu';

import { navigationItems } from './Navitems';
import ListItem from './ListItem';

const DesktopNav = () => {
  return (
    <div className="hidden xl:flex items-center justify-center">
      <div className="bg-muted rounded-full px-6 py-3 h-12 flex items-center justify-center">
        <NavigationMenu viewport={false}>
          <NavigationMenuList className="gap-4">
            {navigationItems.map((item) => (
              <NavigationMenuItem key={item.id} className="relative">
                {item.submenu && item.submenu.length > 0 ? (
                  <>
                    <NavigationMenuTrigger className="group h-auto px-3 py-2 font-medium text-sm text-muted-foreground hover:text-foreground focus:text-foreground transition-all duration-200 bg-transparent border-none shadow-none">
                      <div className="flex flex-col items-center gap-1">
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span className="text-xs whitespace-nowrap text-nowrap">{item.title}</span>
                      </div>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-2 p-4 w-[300px] bg-background rounded-2xl border shadow-lg">
                        
                        <ListItem
                          key={`${item.id}-main`}
                          title={item.title}
                          href={item.href}
                          icon={item.icon}
                          description={item.description}
                        />
                        <hr className="my-1 border-border" />
                        {item.submenu.map((subItem) => (
                          <ListItem
                            key={subItem.id}
                            title={subItem.title}
                            href={subItem.href}
                            icon={subItem.icon}
                            description={subItem.description}
                          />
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink asChild>
                    <Link 
                      href={item.href}
                      className="group h-auto px-3 py-2 font-medium text-sm text-muted-foreground hover:text-foreground focus:text-foreground transition-all duration-200 bg-transparent border-none shadow-none flex flex-col items-center gap-1"
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span className="text-xs">{item.title}</span>
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default DesktopNav;