"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "@/types/auth.types";
import { UserStats } from "./_components/UserStats";
import { UserTable } from "./_components/UserTable";
import { UserDetailModal } from "@/module/dashboard/users/components/user-detail-model";
import { EditUserDetailModal } from "@/module/dashboard/users/components/edit-user-detail-model";
import { useUsers, useUserById } from "@/module/dashboard/users/hooks";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function UsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const pageSizeFromUrl = parseInt(searchParams.get("page_size") || "30", 10);

  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [pageSize, setPageSize] = useState(pageSizeFromUrl);

  const { users, loading, error, pagination, updateUser, searchUser, refetch } =
    useUsers(currentPage, pageSize);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams.toString());
    const hasPage = currentParams.has("page");
    const hasPageSize = currentParams.has("page_size");
    
    if (!hasPage || !hasPageSize) {
      currentParams.set("page", pageFromUrl.toString());
      currentParams.set("page_size", pageSizeFromUrl.toString());
      router.replace(`?${currentParams.toString()}`, { scroll: false });
    }
  }, []);

  useEffect(() => {
    setCurrentPage(pageFromUrl);
    setPageSize(pageSizeFromUrl);
  }, [pageFromUrl, pageSizeFromUrl]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    params.set("page_size", pageSize.toString());
    router.push(`?${params.toString()}`, { scroll: false });
    setCurrentPage(newPage);
  };

  const { user: selectedUser, loading: userLoading } = useUserById(
    selectedUserId || 0
  );

  const { user: editingUser, loading: editUserLoading } = useUserById(
    editingUserId || 0
  );

  const handleEdit = (user: User) => {
    setEditingUserId(user.id);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (userId: number, data: Partial<User>) => {
    setIsSaving(true);
    try {
      const result = await updateUser(userId, data);
      if (result.success) {
        toast.success("User updated successfully", {
          description: "The user information has been updated",
        });
        setIsEditModalOpen(false);
        setEditingUserId(null);
      } else {
        toast.error("Failed to update user", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error("Failed to update user", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleView = (user: User) => {
    setSelectedUserId(user.id);
    setIsViewModalOpen(true);
  };


  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage all users, volunteers, staff, and administrators
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage all users, volunteers, staff, and administrators
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive font-semibold">
              Error loading users
            </p>
            <p className="mt-2 text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const safeUsers = Array.isArray(users) ? users : [];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage all users, volunteers, staff, and administrators
        </p>
      </div>

      <UserStats />

      <UserTable
        users={safeUsers}
        onEdit={handleEdit}
        onView={handleView}
        page={currentPage}
        pageSize={pageSize}
      />

      {pagination.count > 0 && (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 border rounded-lg bg-card">
          {/* Left: Page info in one line */}
          <div className="flex items-center gap-4 text-sm">
            <span className="font-medium text-foreground whitespace-nowrap">
              Page {pagination.current_page} of {pagination.total_pages}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground whitespace-nowrap">
              {pagination.count} total user{pagination.count !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Center: Pagination controls */}
          <Pagination>
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.previous) {
                      handlePageChange(currentPage - 1);
                    }
                  }}
                  className={`
                    transition-all duration-200
                    ${!pagination.previous
                      ? "pointer-events-none opacity-40 cursor-not-allowed"
                      : "cursor-pointer hover:bg-orange-500/10 hover:text-orange-600 hover:border-orange-200"
                    }
                  `}
                  aria-disabled={!pagination.previous}
                />
              </PaginationItem>

              {Array.from(
                { length: pagination.total_pages },
                (_, i) => i + 1
              ).map((pageNum) => {
                const showPage =
                  pageNum === 1 ||
                  pageNum === pagination.total_pages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);

                const showEllipsisBefore =
                  pageNum === currentPage - 2 && currentPage > 3;
                const showEllipsisAfter =
                  pageNum === currentPage + 2 &&
                  currentPage < pagination.total_pages - 2;

                if (showEllipsisBefore || showEllipsisAfter) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationEllipsis className="text-muted-foreground" />
                    </PaginationItem>
                  );
                }

                if (!showPage) return null;

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageNum);
                      }}
                      isActive={pageNum === currentPage}
                      className={`
                        cursor-pointer transition-all duration-200 min-w-[40px]
                        ${pageNum === currentPage
                          ? "bg-orange-500 text-white hover:bg-orange-600 border-orange-500 shadow-sm font-semibold"
                          : "hover:bg-orange-500/10 hover:text-orange-600 hover:border-orange-200"
                        }
                      `}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.next) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                  className={`
                    transition-all duration-200
                    ${!pagination.next
                      ? "pointer-events-none opacity-40 cursor-not-allowed"
                      : "cursor-pointer hover:bg-orange-500/10 hover:text-orange-600 hover:border-orange-200"
                    }
                  `}
                  aria-disabled={!pagination.next}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {/* Right: Page size selector */}
          <select
            value={pageSize}
            onChange={(e) => {
              const newSize = parseInt(e.target.value, 10);
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", "1");
              params.set("page_size", newSize.toString());
              router.push(`?${params.toString()}`, { scroll: false });
            }}
            className="text-sm border rounded-lg px-3 py-2 bg-background hover:bg-accent transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 min-w-[140px]"
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="30">30 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
        </div>
      )}

      <UserDetailModal
        user={selectedUser}
        open={isViewModalOpen}
        onOpenChange={(open) => {
          setIsViewModalOpen(open);
          if (!open) {
            setSelectedUserId(null);
          }
        }}
        loading={userLoading}
      />

      <EditUserDetailModal
        user={editingUser}
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) {
            setEditingUserId(null);
          }
        }}
        onSave={handleSaveEdit}
        loading={isSaving}
      />
    </div>
  );
}
