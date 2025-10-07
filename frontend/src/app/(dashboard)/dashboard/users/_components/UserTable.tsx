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
  User as UserIcon,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import useAxios from "@/hooks/use-axios";

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

  const debounce = (fn: (...args: any[]) => void, wait = 500) => {
    let t: ReturnType<typeof setTimeout> | null = null;
    return (...args: any[]) => {
      if (t) clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
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
        const filterParams: Record<string, any> = {
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

        const response = await axios.get("/admin/users/", {
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
          const response = await axios.get("/admin/users/", {
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

  const getUserPrimaryRole = (
    user: User
  ): {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  } => {
    if (user.is_blocked) {
      return { label: "Blocked", variant: "destructive" };
    }
    if (user.is_admin_account || user.is_superuser) {
      return { label: "Admin", variant: "destructive" };
    }
    if (user.is_staff_account) {
      return { label: "Staff", variant: "default" };
    }
    if (user.is_volunteer) {
      return { label: "Volunteer", variant: "outline" };
    }
    if (user.is_member_account) {
      return { label: "Member", variant: "secondary" };
    }

    return { label: "User", variant: "secondary" };
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
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone, or user ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
            autoComplete="off"
            type="text"
            disabled={isSearching}
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
          )}
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[180px]">
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={toggleSortOrder}
                  className="h-8 p-0 hover:bg-transparent"
                >
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Profession</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              sortedUsers.map((user) => {
                const primaryRole = getUserPrimaryRole(user);
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>
                          {user.image ? (
                            <UserIcon className="h-5 w-5" />
                          ) : (
                            getInitials(user.name)
                          )}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {user.name}
                        {user.is_verified && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Verified User</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <Link
                        href={`mailto:${user.email}`}
                        className="hover:text-blue-600 hover:underline"
                      >
                        {user.email}
                      </Link>
                    </TableCell>
                    <TableCell>
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
                    <TableCell className="capitalize">
                      {user.profession || "N/A"}
                    </TableCell>
                    <TableCell className="capitalize">
                      {user.gender || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={primaryRole.variant}>
                        {primaryRole.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onView(user)}
                              >
                                <Eye className="h-4 w-4" />
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
                                className="h-8 w-8"
                                onClick={() => onEdit(user)}
                              >
                                <Edit className="h-4 w-4" />
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
