"use client";
import React, { useState } from 'react';
import { Target, Briefcase, Activity, User, ListTodo } from 'lucide-react';

type RouteType = 'overview' | 'myjobs' | 'activities' | 'profile';

const RouteBar = () => {
  const [activeRoute, setActiveRoute] = useState<RouteType>('overview');

  const routes = [
    {
      id: 'overview' as RouteType,
      label: 'Overview',
      icon: Target,
    },
    {
      id: 'myjobs' as RouteType,
      label: 'My Jobs',
      icon: ListTodo,
    },
    {
      id: 'activities' as RouteType,
      label: 'Activities',
      icon: Activity,
    },
    {
      id: 'profile' as RouteType,
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <div className="bg-white  rounded-xl shadow-lg p-1 mt-6 mb-6">
      <div className="flex items-center justify-center ">
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive = activeRoute === route.id;
          
          return (
            <button
              key={route.id}
              onClick={() => setActiveRoute(route.id)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm
                transition-all duration-200 hover:scale-105
                ${isActive 
                  ? 'bg-white text-black shadow-md' 
                  : 'hover:text-gray-900 text-gray-500 hover:bg-gray-200'
                }
              `}
            >
              <Icon size={16} />
              <span>{route.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RouteBar;
