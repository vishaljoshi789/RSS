'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Loader2, Search, MapPin, Phone, Mail, Calendar, Filter, Users, FileText, Shield
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from '@/components/ui/dialog';
import useAxios from '@/hooks/use-axios';

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  image: string | null;
  profession: string | null;
  city: string | null;
  district: string | null;
  state: string | null;
  is_verified: boolean;
  is_admin_account: boolean;
};

type Volunteer = {
  id: number;
  user: User;
  wing_name: string;
  level_name: string;
  designation_title: string;
  phone_number: string;
  affidavit: string | null;
  joined_date: string;
  aadhar_card_front: string | null;
  aadhar_card_back: string | null;
  image: string | null;
  can_view_member_data: boolean;
};

const VolunteerCard: React.FC<{ canView: boolean }> = ({ canView }) => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const axios = useAxios();

  useEffect(() => {
    async function fetchVolunteers() {
      try {
        const res = await axios.get('/volunteer/volunteers/');
        const results = res.data.results || [];
        setVolunteers(results);
        setFilteredVolunteers(results);
      } catch (error) {
        console.error('Error fetching volunteers:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchVolunteers();
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    const filtered = volunteers.filter((v) => {
      const u = v.user;
      return (
        u.name?.toLowerCase().includes(q) ||
        u.username?.toLowerCase().includes(q) ||
        u.profession?.toLowerCase().includes(q) ||
        u.city?.toLowerCase().includes(q) ||
        u.state?.toLowerCase().includes(q) ||
        u.district?.toLowerCase().includes(q) ||
        v.phone_number?.includes(q)
      );
    });
    setFilteredVolunteers(filtered);
  }, [searchQuery, volunteers]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="backdrop-blur-md bg-white/80 border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-7 w-7 text-blue-600" />
              Volunteers
            </h1>
            <p className="text-gray-600 text-sm">
              {filteredVolunteers.length} active volunteer(s)
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search name, phone, city..."
                className="pl-10 pr-4 py-2 w-full border-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>
      </div>

      {/* Volunteer Cards */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {filteredVolunteers.length === 0 ? (
          <div className="text-center py-20">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No volunteers found</h3>
            <p className="text-gray-500">Try changing your search filters</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVolunteers.map((volunteer, i) => {
              const u = volunteer.user;
              return (
                <motion.div
                  key={volunteer.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Card className="bg-white border border-gray-100 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-xl">
                    <CardHeader className="pb-3 pt-6 px-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16 ring-4 ring-blue-50 shadow-sm">
                          {u.image ? (
                            <AvatarImage src={u.image} alt={u.name} />
                          ) : (
                            <AvatarFallback className="bg-blue-500 text-white font-semibold">
                              {u.name?.[0]?.toUpperCase() || 'V'}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-gray-900 truncate">{u.name}</h3>
                          <p className="text-sm text-gray-600">{u.profession || 'Volunteer'}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                              {volunteer.wing_name}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-gray-300">
                              {volunteer.level_name}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-gray-300">
                              {volunteer.designation_title}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="px-6 pb-6 space-y-3">
                      <div className="flex items-start gap-2 text-sm text-gray-700">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <span>{[u.city, u.district, u.state].filter(Boolean).join(', ')}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{u.email}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{volunteer.phone_number}</span>
                      </div>

                      {volunteer.affidavit && (
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <a
                            href={volunteer.affidavit}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Affidavit
                          </a>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-gray-500 border-t pt-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        Joined {new Date(volunteer.joined_date).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>

                      {/* Dialog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => setSelectedVolunteer(volunteer)}
                          >
                            View Profile
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Volunteer Profile</DialogTitle>
                            <DialogDescription>
                              Full details of {u.name}
                            </DialogDescription>
                          </DialogHeader>

                          <div className="mt-4 space-y-3 text-sm">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-14 w-14">
                                <AvatarImage src={u.image || ''} />
                                <AvatarFallback>{u.name?.[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium text-gray-900">{u.name}</h3>
                                <p className="text-gray-600">{u.email}</p>
                                <Badge variant="outline" className="mt-1 text-xs border-gray-300">
                                  {volunteer.designation_title}
                                </Badge>
                              </div>
                            </div>

                            <p><b>Phone:</b> {volunteer.phone_number}</p>
                            <p><b>Profession:</b> {u.profession}</p>
                            <p><b>City:</b> {u.city}</p>
                            <p><b>District:</b> {u.district}</p>
                            <p><b>State:</b> {u.state}</p>
                            <p><b>Wing:</b> {volunteer.wing_name}</p>
                            <p><b>Level:</b> {volunteer.level_name}</p>
                            <p><b>Designation:</b> {volunteer.designation_title}</p>

                            <div className="pt-3 border-t">
                              <p className="text-gray-500 text-xs">
                                Joined on {new Date(volunteer.joined_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VolunteerCard;
