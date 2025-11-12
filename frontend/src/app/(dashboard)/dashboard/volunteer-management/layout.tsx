import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Volunteer Management | RSS Dashboard',
  description: 'Manage volunteers, track volunteer activities, assignments, and contributions for RASHTRIYA SEVA SANGH',
}

const VolunteerManagementLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>{children}</>
  )
}

export default VolunteerManagementLayout