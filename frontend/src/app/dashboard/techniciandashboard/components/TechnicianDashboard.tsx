"use client";
import  { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import MainBar from './MainBar';
import RouteBar, { RouteType } from './RouteBar';
import Profile from './Profile';
import StatsDashboard from './StatsOverview';
import Overview from './Overview';
import MyJobs from './MyJobs';

const TechnicianDashboard = () => {
  const router = useRouter();
  const [activeRoute, setActiveRoute] = useState<RouteType>('overview');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      // No token, redirect to sign-in
      router.push('/auth/signIn');
      return;
    }
    
    setIsAuthenticated(true);
  }, [router]);

  const handleProfileUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Don't render until authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <MainBar refreshTrigger={refreshTrigger} />
        <div className="flex flex-col sm:flex-row gap-4 mt-5">
        <div className="flex-1 ">
          <StatsDashboard refreshTrigger={refreshTrigger} />
        </div>
       
      </div>
      <RouteBar activeRoute={activeRoute} onRouteChange={setActiveRoute} />
      
      {/* Conditional Rendering based on active route */}
      {activeRoute === 'overview' && <Overview refreshTrigger={refreshTrigger} />}
      
      {activeRoute === 'profile' && <Profile onProfileUpdate={handleProfileUpdate} />}
      {activeRoute === 'myjobs' && <MyJobs refreshTrigger={refreshTrigger} />}
      {activeRoute === 'activities' && (
        <div className="bg-white border border-indigo-100 rounded-2xl shadow-lg p-8 mt-6">
          <h2 className="text-2xl font-bold text-gray-800">Activities</h2>
          <p className="text-gray-600 mt-2">Activities section coming soon...</p>
        </div>
      )}
    </div>
  )
}

export default TechnicianDashboard
