"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { User } from "@/types/auth.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  Edit,
  Search,
  ArrowUpDown,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import useAxios from "@/hooks/use-axios";
import { getUserImageUrl } from "@/lib/media";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onView: (user: User) => void;
  page: number;
  pageSize: number;
}

export function UserTable({
  users: initialUsers,
  onEdit,
  onView,
  page,
  pageSize,
}: UserTableProps) {
  const axios = useAxios();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterType, setFilterType] = useState<string>("all");
  const [isSearching, setIsSearching] = useState(false);
  const [displayUsers, setDisplayUsers] = useState<User[]>(initialUsers);
  const hasSearchedRef = useRef(false);
  const hasFilteredRef = useRef(false);

  useEffect(() => {
    if (!hasSearchedRef.current && !hasFilteredRef.current) {
      setDisplayUsers(initialUsers);
    }
  }, [initialUsers]);

  const debounce = (fn: (value: string) => void, wait = 500) => {
    let t: ReturnType<typeof setTimeout> | null = null;
    return (value: string) => {
      if (t) clearTimeout(t);
      t = setTimeout(() => fn(value), wait);
    };
  };

  const handleFilterChange = useCallback(
    async (filter: string) => {
      if (filter === "all") {
        hasFilteredRef.current = false;
        setDisplayUsers(initialUsers);
        return;
      }

      setIsSearching(true);
      hasFilteredRef.current = true;

      try {
        const filterParams: Record<string, string | number | boolean> = {
          page,
          page_size: pageSize,
        };

        switch (filter) {
          case "admin":
            filterParams.is_admin_account = true;
            break;
          case "staff":
            filterParams.is_staff_account = true;
            break;
          case "member":
            filterParams.is_member_account = true;
            break;
          case "volunteer":
            filterParams.is_volunteer = true;
            break;
          case "verified":
            filterParams.is_verified = true;
            break;
          case "blocked":
            filterParams.is_blocked = true;
            break;
          case "business":
            filterParams.is_business_account = true;
            break;
        }

        const response = await axios.get("/account/list/", {
          params: filterParams,
        });

        const userData = response.data;
        let filterResults: User[] = [];

        if (Array.isArray(userData)) {
          filterResults = userData;
        } else if (userData && Array.isArray(userData.results)) {
          filterResults = userData.results;
        } else if (userData && Array.isArray(userData.data)) {
          filterResults = userData.data;
        }

        setDisplayUsers(filterResults);
      } catch (error) {
        console.error("Filter error:", error);
      } finally {
        setIsSearching(false);
      }
    },
    [axios, page, pageSize, initialUsers]
  );

  const handleSearchChange = useCallback(
    async (searchValue: string) => {
      setIsSearching(true);

      try {
        if (searchValue.trim()) {
          hasSearchedRef.current = true;
          const response = await axios.get("/account/list/", {
            params: {
              search: searchValue.trim(),
              page,
              page_size: pageSize,
            },
          });

          const userData = response.data;
          let searchResults: User[] = [];

          if (Array.isArray(userData)) {
            searchResults = userData;
          } else if (userData && Array.isArray(userData.results)) {
            searchResults = userData.results;
          } else if (userData && Array.isArray(userData.data)) {
            searchResults = userData.data;
          }

          setDisplayUsers(searchResults);
        } else if (searchValue.trim() === "" && hasSearchedRef.current) {
          hasSearchedRef.current = false;
          setDisplayUsers(initialUsers);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    },
    [axios, page, pageSize, initialUsers]
  );

  const debouncedSearchRef = useRef(handleSearchChange);
  useEffect(() => {
    debouncedSearchRef.current = handleSearchChange;
  }, [handleSearchChange]);

  const debouncedInvokerRef = useRef<((value: string) => void) | null>(null);
  useEffect(() => {
    debouncedInvokerRef.current = debounce((value: string) => {
      debouncedSearchRef.current(value);
    }, 500);
  }, []);

  useEffect(() => {
    if (searchTerm === "" && !hasSearchedRef.current) {
      return;
    }

    if (searchTerm !== "") {
      hasSearchedRef.current = true;
    }

    debouncedInvokerRef.current?.(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    handleFilterChange(filterType);
  }, [filterType, handleFilterChange]);

  const getUserRoles = (
    user: User
  ): Array<{
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }> => {
    const roles: Array<{
      label: string;
      variant: "default" | "secondary" | "destructive" | "outline";
    }> = [];

    if (user.is_blocked) {
      roles.push({ label: "Blocked", variant: "destructive" });
    }

    if (user.is_admin_account || user.is_superuser) {
      roles.push({ label: "Admin", variant: "destructive" });
    }
    if (user.is_staff_account) {
      roles.push({ label: "Staff", variant: "default" });
    }
    if (user.is_volunteer) {
      roles.push({ label: "Volunteer", variant: "outline" });
    }
    if (user.is_member_account) {
      roles.push({ label: "Member", variant: "secondary" });
    }
    if (user.is_business_account) {
      roles.push({ label: "Business", variant: "outline" });
    }
    if (user.is_field_worker) {
      roles.push({ label: "Field Worker", variant: "outline" });
    }

    if (roles.length === 0) {
      roles.push({ label: "User", variant: "secondary" });
    }

    return roles;
  };


  const getInitials = (name: string | null | undefined) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  
  const sortedUsers = [...displayUsers].sort((a, b) => {
    const nameA = a.name || "";
    const nameB = b.name || "";
    if (sortOrder === "asc") {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone, or user ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 sm:pl-10 pr-8 sm:pr-10 h-9 sm:h-10 text-sm"
            autoComplete="off"
            type="text"
            disabled={isSearching}
          />
          {isSearching && (
            <Loader2 className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground animate-spin" />
          )}
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[160px] lg:w-[180px] h-9 sm:h-10 text-sm">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="member">Member</SelectItem>
            <SelectItem value="volunteer">Volunteer</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm">User</TableHead>
              <TableHead className="text-xs sm:text-sm">
                <Button
                  variant="ghost"
                  onClick={toggleSortOrder}
                  className="h-8 p-0 hover:bg-transparent text-xs sm:text-sm"
                >
                  Name
                  <ArrowUpDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell text-xs sm:text-sm">Email</TableHead>
              <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Phone</TableHead>
              <TableHead className="hidden lg:table-cell text-xs sm:text-sm">Profession</TableHead>
              <TableHead className="hidden xl:table-cell text-xs sm:text-sm">Gender</TableHead>
              <TableHead className="text-xs sm:text-sm">Roles</TableHead>
              <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-6 sm:py-8 text-xs sm:text-sm text-muted-foreground"
                >
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              sortedUsers.map((user) => {
                const userRoles = getUserRoles(user);
                const userImageUrl = getUserImageUrl(user.image);
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                        {userImageUrl && (
                          <AvatarImage src={userImageUrl} alt={user.name || "User"} />
                        )}
                        <AvatarFallback className="text-xs sm:text-sm">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium text-xs sm:text-sm">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate">{user.name}</span>
                          {user.referred_by && (
                            <Badge 
                              variant="outline" 
                              className="bg-pink-50 text-pink-700 border-pink-200 text-xs px-1.5 py-0.5 hidden sm:inline-flex"
                            >
                              Referred
                            </Badge>
                          )}
                          {user.is_verified && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Verified User</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        <div className="md:hidden space-y-0.5">
                          <div className="text-xs text-muted-foreground truncate">
                            <Link href={`mailto:${user.email}`} className="hover:underline">
                              {user.email}
                            </Link>
                          </div>
                          <div className="sm:hidden text-xs text-muted-foreground">
                            {user.phone ? (
                              <a href={`tel:${user.phone}`} className="hover:underline">{user.phone}</a>
                            ) : "N/A"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs sm:text-sm text-muted-foreground">
                      <Link
                        href={`mailto:${user.email}`}
                        className="hover:text-blue-600 hover:underline truncate block"
                      >
                        {user.email}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                      {user.phone ? (
                        <a
                          href={`tel:${user.phone}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {user.phone}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell capitalize text-xs sm:text-sm">
                      {user.profession || "N/A"}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell capitalize text-xs sm:text-sm">
                      {user.gender || "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {userRoles.map((role, index) => (
                          <Badge key={index} variant={role.variant} className="text-xs">
                            {role.label}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 sm:h-8 sm:w-8"
                                onClick={() => onView(user)}
                              >
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Details</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 sm:h-8 sm:w-8"
                                onClick={() => onEdit(user)}
                              >
                                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit User</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
