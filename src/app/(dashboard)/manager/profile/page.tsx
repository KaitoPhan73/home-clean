"use client";

import { useState, useEffect } from "react";
import { TManagerResponse } from "@/schema/manager.schema";
import { getAllManagers } from "@/apis/manager";

export default function ManagerProfilePage() {
  const [manager, setManager] = useState<TManagerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [showFullId, setShowFullId] = useState(false);

  useEffect(() => {
    const fetchManagerProfile = async () => {
      try {
        setLoading(true);

        let userRaw = "";

        if (document.cookie) {
          const cookies = document.cookie.split(";");
          for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith("user=")) {
              userRaw = cookie.substring("user=".length, cookie.length);
              break;
            }
          }
        }

        if (!userRaw) {
          userRaw = localStorage.getItem("user") || "";
        }

        if (!userRaw) {
          setError("User information not found");
          setLoading(false);
          return;
        }

        const user = JSON.parse(userRaw);
        const managerId = user.userId;
        const response = await getAllManagers({ id: managerId });

        if (response.payload.items && response.payload.items.length > 0) {
          const matchedManager = response.payload.items.find(
            (item: TManagerResponse) => item.id === managerId
          );
          if (matchedManager) {
            setManager(matchedManager);
          } else {
            setError("Manager profile not found for the specified ID");
          }
        } else {
          setError("Manager profile not found");
        }
      } catch (err) {
        console.error("Error fetching manager profile:", err);
        setError("Could not load profile information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchManagerProfile();
  }, []);

  useEffect(() => {
    // Make sure the entire page has scrolling enabled
    document.documentElement.style.overflowY = 'auto';
    document.body.style.overflowY = 'auto';
    
    return () => {
      document.documentElement.style.overflowY = '';
      document.body.style.overflowY = '';
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow">
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string | undefined) => {
    if (!name) return "M";
    return name
      .split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Background header */}
      <div className="h-32 bg-gradient-to-r from-blue-700 to-blue-500"></div>
      
      <div className="container mx-auto px-4 -mt-16">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow mb-6">
          {/* Profile Header */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center border-4 border-white shadow">
                <div className="text-4xl font-bold text-blue-600">
                  {getInitials(manager?.fullName)}
                </div>
              </div>

              {/* Main Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-800">{manager?.fullName}</h1>
                <p className="text-lg text-gray-600 mb-2">Manager at Company Name</p>
                <div className="inline-block px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 font-medium">
                  {manager?.status || "Active"}
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                    Management
                  </span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                    Leadership
                  </span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                    Team Building
                  </span>
                </div>
              </div>

              {/* <div className="mt-4 md:mt-0 flex flex-col gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-medium transition flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit Profile
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 font-medium transition flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Change Password
                </button>
              </div> */}
            </div>
          </div>

          {/* Navigation Tabs - Sticky */}
          <div className="border-t border-gray-200 sticky top-0 bg-white z-10">
            <div className="flex overflow-x-auto scrollbar-hide">
              <button 
                className={`px-6 py-4 font-medium text-gray-700 border-b-2 whitespace-nowrap ${activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:border-gray-300'}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              {/* <button 
                className={`px-6 py-4 font-medium text-gray-700 border-b-2 whitespace-nowrap ${activeTab === 'activity' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:border-gray-300'}`}
                onClick={() => setActiveTab('activity')}
              >
                Activity
              </button>
              <button 
                className={`px-6 py-4 font-medium text-gray-700 border-b-2 whitespace-nowrap ${activeTab === 'teams' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:border-gray-300'}`}
                onClick={() => setActiveTab('teams')}
              >
                Teams
              </button>
              <button 
                className={`px-6 py-4 font-medium text-gray-700 border-b-2 whitespace-nowrap ${activeTab === 'settings' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:border-gray-300'}`}
                onClick={() => setActiveTab('settings')}
              >
                Settings
              </button> */}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-1">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="text-blue-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Email</p>
                    <p className="font-medium break-all">{manager?.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-blue-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Phone</p>
                    <p className="font-medium">{manager?.phoneNumber}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-blue-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Location</p>
                    <p className="font-medium">HomePLus - S605-0520 VinHomes Grand Park</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-blue-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Manager Code</p>
                    <p className="font-medium">{manager?.code}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Account Details
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-500 text-sm">Manager ID</p>
                  <div className="flex items-center">
                    <p className={`font-medium ${showFullId ? '' : 'truncate'}`}>
                      {manager?.id}
                    </p>
                    <button 
                      onClick={() => setShowFullId(!showFullId)} 
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {showFullId ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Role</p>
                  <p className="font-medium">Manager</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Created At</p>
                  <p className="font-medium">
                    {manager?.createdAt
                      ? new Date(manager.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Last Updated</p>
                  <p className="font-medium">
                    {manager?.updatedAt
                      ? new Date(manager.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2">
            {/* About - Now with fixed height to match left column */}
            <div className="bg-white rounded-lg shadow p-6 mb-6 h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">About</h2>
                {/* <button className="text-blue-600 hover:text-blue-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button> */}
              </div>
              <div className="text-gray-600 overflow-y-auto pr-2" style={{ height: 'calc(100% - 40px)' }}>
                <p>
                  Experienced manager with a demonstrated history of working in the technology industry. 
                  Skilled in team leadership, strategic planning, and process optimization. Strong 
                  professional with excellent communication and interpersonal skills.
                </p>
                <p className="mt-4">
                  I have over 5 years of experience managing teams across various departments and projects.
                  My focus is on developing talent, improving processes, and delivering results that exceed expectations.
                  I believe in a collaborative approach to leadership and am committed to fostering an inclusive and innovative work environment.
                </p>
                <p className="mt-4">
                  Throughout my career, I have successfully led multiple high-priority initiatives, resulting in significant improvements in team productivity and customer satisfaction.
                  I am passionate about creating efficient workflows and implementing strategies that align with organizational goals.
                </p>
                <p className="mt-4">
                  I believe in transparent communication and creating opportunities for team members to grow professionally. By setting clear expectations and providing constructive feedback, I help individuals realize their full potential and contribute meaningfully to organizational success.
                </p>
                <p className="mt-4">
                  My approach combines analytical thinking with creative problem-solving. I continuously seek to improve processes, implement innovative solutions, and adapt to changing business needs. I have a strong track record of meeting and exceeding targets while maintaining high team morale and engagement.
                </p>
                <p className="mt-4">
                  Outside of work, I enjoy staying updated on industry trends and advancements. I regularly participate in professional development activities, networking events, and leadership workshops to enhance my skills and knowledge. I am committed to lifelong learning and continuous improvement both professionally and personally.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}