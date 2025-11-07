"use client"

import React, { useEffect, useState } from 'react'
import useAxios from '@/hooks/use-axios'
import { User } from '@/types/auth.types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, Edit, ArrowUpDown, User as UserIcon, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

const Member: React.FC = () => {
  const api = useAxios()
  const [users, setUsers] = useState<User[]>([])
  const [page] = useState<number>(1)
  const [pageSize] = useState<number>(25)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [debouncedTerm, setDebouncedTerm] = useState<string>('')
  const [filterType, setFilterType] = useState<'all' | 'volunteer' | 'member'>('all')

  useEffect(() => {
    let mounted = true
    const fetchUsers = async () => {
      try {
        const filterParams: Record<string, string | number | boolean> = { page, page_size: pageSize }
        if (debouncedTerm) filterParams.search = debouncedTerm
        if (filterType === 'volunteer') filterParams.is_volunteer = true
        if (filterType === 'member') filterParams.is_member_account = true

        const resp = await api.get('/account/list/?is_member_account=true', { params: filterParams })
        const data = resp.data
        let list: User[] = []
        if (Array.isArray(data)) list = data
        else if (data && Array.isArray(data.results)) list = data.results
        else if (data && Array.isArray(data.data)) list = data.data
        if (mounted) setUsers(list)
      } catch (err) {
        if (err instanceof Error) {
          console.error('Failed to fetch users', err)
        }
      }
    }

    fetchUsers()
    return () => { mounted = false }
  }, [api, page, pageSize, debouncedTerm, filterType])

  const toggleSortOrder = () => setSortOrder((s) => (s === 'asc' ? 'desc' : 'asc'))

  const getUserRoles = (user: User) => {
    const roles: { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }[] = []
    if (user.is_blocked) roles.push({ label: 'Blocked', variant: 'destructive' })
    if (user.is_admin_account || user.is_superuser) roles.push({ label: 'Admin', variant: 'destructive' })
    if (user.is_staff_account) roles.push({ label: 'Staff', variant: 'default' })
    if (user.is_volunteer) roles.push({ label: 'Volunteer', variant: 'outline' })
    if (user.is_member_account) roles.push({ label: 'Member', variant: 'secondary' })
    if (user.is_business_account) roles.push({ label: 'Business', variant: 'outline' })
    if (user.is_field_worker) roles.push({ label: 'Field Worker', variant: 'outline' })
    if (roles.length === 0) roles.push({ label: 'User', variant: 'secondary' })
    return roles
  }

  const getInitials = (name?: string | null) => {
    if (!name) return '??'
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  }

  useEffect(() => {
    const t = setTimeout(() => setDebouncedTerm(searchTerm.trim()), 500)
    return () => clearTimeout(t)
  }, [searchTerm])

  const sortedUsers = [...users].sort((a, b) => {
    const nameA = a.name || ''
    const nameB = b.name || ''
    return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
  })

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">People / Volunteers</h2>

      <div className="flex gap-3 items-center mb-3">
        <Input placeholder="Search by name, email, phone, or user id..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full max-w-md" />

        <Select value={filterType} onValueChange={(v) => setFilterType(v as 'all' | 'volunteer' | 'member')}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="volunteer">Volunteer</SelectItem>
            <SelectItem value="member">Member</SelectItem>
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
              <TableHead>Roles</TableHead>
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
                const userRoles = getUserRoles(user)
                return (
                  <React.Fragment key={user.id}>
                    <TableRow>
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
                          {user.referred_by && (
                            <Badge 
                              variant="outline" 
                              className="bg-pink-50 text-pink-700 border-pink-200 text-xs px-1.5 py-0.5"
                            >
                              Referred
                            </Badge>
                          )}
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
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell className="capitalize">
                        {user.profession || 'N/A'}
                      </TableCell>
                      <TableCell className="capitalize">
                        {user.gender || 'N/A'}
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
                        <div className="flex items-center justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
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
                  </React.Fragment>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Member