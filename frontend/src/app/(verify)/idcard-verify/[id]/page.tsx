'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import useAxios from '@/hooks/use-axios';
import { User } from '@/types/auth.types';

const IDCardManagement = () => {
  const { id } = useParams(); 
  const axios = useAxios();
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);
 

  const quote = 'सेवा परमो धर्मः';

  useEffect(() => {
    async function fetchMemberData() {
      if (!id) return;
      try {
        const res = await axios.get(`/account/list/?user_id=${id}`);
        if (res.data?.results?.length > 0) {
          setUser(res.data.results[0]);
        }
      } catch (error) {
        console.error('Error fetching member data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMemberData();
  }, [id, axios]);


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-600">
        Loading ID Card...
      </div>
    );
  }

   if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-sm bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="relative">
          <img
            src={user.image}
            alt="User"
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white px-4 py-2">
            <h2 className="text-lg font-semibold capitalize">{user.name}</h2>
            <p className="text-sm">{user.profession}</p>
          </div>
        </div>

        <div className="p-5">
          <div className="text-sm text-gray-600 space-y-2">
            <p><span className="font-medium text-gray-800">User ID:</span> {user.user_id}</p>
            <p><span className="font-medium text-gray-800">Email:</span> {user.email}</p>
            <p><span className="font-medium text-gray-800">Phone:</span> {user.phone}</p>
            <p><span className="font-medium text-gray-800">Gender:</span> {user.gender}</p>
            <p><span className="font-medium text-gray-800">DOB:</span> {user.dob}</p>
            <p><span className="font-medium text-gray-800">Address:</span> {user.street}, {user.city}</p>
            <p><span className="font-medium text-gray-800">State:</span> {user.state}</p>
            <p><span className="font-medium text-gray-800">Country:</span> {user.country}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDCardManagement;
