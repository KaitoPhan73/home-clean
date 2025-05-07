/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { getEmployeeProfileById } from "@/apis/laudry/employee"
import { TEmployeeLaundryResponse } from "@/schema/VinLaudry/employee.schema"
import { useState, useEffect } from "react"

const ProfileCard = ({ label, value }: { label: string; value: string | null }) => (
  <div className="bg-white p-4 rounded-lg shadow mb-4">
    <h3 className="text-sm font-medium text-gray-500">{label}</h3>
    <p className="text-base font-semibold text-gray-900 mt-1">{value || "—"}</p>
  </div>
)

const StatusBadge = ({ status }: { status: "Active" | "Inactive" | "Pending" }) => {
  const statusStyles: { [key in "Active" | "Inactive" | "Pending"]: string } = {
    Active: "bg-green-100 text-green-800",
    Inactive: "bg-red-100 text-red-800",
    Pending: "bg-yellow-100 text-yellow-800",
  }
  
  const style = statusStyles[status] || "bg-gray-100 text-gray-800"
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {status}
    </span>
  )
}

export default function ManagerProfile() {
  const [profile, setProfile] = useState<TEmployeeLaundryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchManagerProfile = async () => {
      try {
        const userCookie = document.cookie
          .split("; ")
          .find(row => row.startsWith("user"))
          ?.split("=")[1]

        if (!userCookie) {
          throw new Error("User information not found. Please login again.")
        }

        const user = JSON.parse(decodeURIComponent(userCookie))
        const userId = user?.userId
        const accessToken = user?.accessToken

        if (!userId) {
          throw new Error("User ID not found. Please login again.")
        }

        const profileData = await getEmployeeProfileById(userId, accessToken)
        setProfile(profileData.payload)
      } catch (err: any) {
        setError(err.message || "Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchManagerProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button 
              className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 py-1 px-3 rounded text-sm"
              onClick={() => window.location.href = "/login"}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
              <div className="flex items-center justify-center">
                <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-blue-800 text-2xl font-bold">
                  {profile?.fullName?.split(" ").map(word => word[0]).join("").toUpperCase()}
                </div>
              </div>
              <h2 className="text-center text-xl font-bold text-white mt-4">{profile?.fullName}</h2>
              <div className="text-center text-blue-100 mb-2">{profile?.position || "Manager"}</div>
              <div className="flex justify-center mt-2">
                <StatusBadge status={profile?.status as "Active" | "Inactive" | "Pending"} />
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0 Jz0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <span className="text-gray-700">{profile?.email}</span>
              </div>
              <div className="flex items-center mb-4">
                <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-700">{profile?.phone}</span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-700">{profile?.address}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Profile Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ProfileCard label="Employee Code" value={profile?.employeeCode ?? null} />
              <ProfileCard label="Role" value={profile?.role ?? null} />
              <ProfileCard label="Created At" value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "—"} />
              <ProfileCard label="Updated At" value={profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : "—"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}