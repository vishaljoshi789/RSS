"use client"

import React, { useEffect, useState } from 'react'
import useAxios from '@/hooks/use-axios'
import { Loader2, Search, Users, FileText, Eye } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { VolunteerWithUser, ViewVolunteerModal } from '@/module/dashboard/volunteer'

const VolunteerCard: React.FC = () => {
  const api = useAxios()
  const [volunteers, setVolunteers] = useState<VolunteerWithUser[]>([])
  const [filteredVolunteers, setFilteredVolunteers] = useState<VolunteerWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerWithUser | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    const fetchVolunteers = async () => {
      try {
        setLoading(true)
        const res = await api.get('/volunteer/volunteers/')
        const results = res.data.results || []
        if (mounted) {
          setVolunteers(results)
          setFilteredVolunteers(results)
        }
      } catch (error) {
        console.error('Error fetching volunteers:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchVolunteers()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    const q = searchQuery.toLowerCase()
    const filtered = volunteers.filter((v) => {
      const u = v.user
      return (
        u.name?.toLowerCase().includes(q) ||
        u.username?.toLowerCase().includes(q) ||
        u.profession?.toLowerCase().includes(q) ||
        u.city?.toLowerCase().includes(q) ||
        u.state?.toLowerCase().includes(q) ||
        u.district?.toLowerCase().includes(q) ||
        v.phone_number?.includes(q)
      )
    })
    setFilteredVolunteers(filtered)
  }, [searchQuery, volunteers])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Volunteers
          </h2>
          <p className="text-sm text-muted-foreground">{filteredVolunteers.length} active volunteer(s)</p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search name, phone, city..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>
      </div>

      {filteredVolunteers.length === 0 ? (
        <div className="text-center py-20 border rounded-lg bg-muted/10">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="text-xl font-semibold mb-2">No volunteers found</h3>
          <p className="text-muted-foreground">Try changing your search filters</p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[60px]">Photo</TableHead>
                <TableHead className="min-w-[150px]">Name</TableHead>
                <TableHead className="min-w-[200px]">Contact</TableHead>
                <TableHead>Wing</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead className="w-[100px]">Affidavit</TableHead>
                <TableHead className="w-[130px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVolunteers.map((volunteer) => {
                const u = volunteer.user
                return (
                  <TableRow key={volunteer.id}>
                    <TableCell>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={u.image ?? ''} alt={u.name ?? 'volunteer'} />
                        <AvatarFallback>{(u.name || u.username || 'V').slice(0,2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </TableCell>

                    <TableCell className="font-medium">{u.name}</TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-muted-foreground">{u.email}</span>
                        <span className="text-sm font-medium">{volunteer.phone_number || u.phone}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-sm">{volunteer.wing_name || '—'}</TableCell>

                    <TableCell className="text-sm">{volunteer.level_name || '—'}</TableCell>

                    <TableCell className="text-sm">{volunteer.designation_title || '—'}</TableCell>

                    <TableCell>
                      {volunteer.affidavit ? (
                        <a href={volunteer.affidavit} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1 text-sm">
                          <FileText className="w-4 h-4"/> View
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {volunteer.can_view_member_data ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.1)]"
                            onClick={() => {
                              setSelectedVolunteer(volunteer)
                              setIsModalOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.1)] opacity-50"
                            disabled
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <ViewVolunteerModal
        volunteer={selectedVolunteer}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  )
}

export default VolunteerCard
