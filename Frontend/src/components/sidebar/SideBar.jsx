import React from 'react';
import {CircleUser, LogOut, Bell} from "lucide-react";
import SwitchTap from './SwitchTap';

const SideBar = () => {
  return (
    <div className="w-1/4 bg-slate-900 text-white min-h-screen flex-shrink-0">
      <div className="flex items-center bg-slate-800 p-6 rounded-b-md shadow-md mb-6">
        <CircleUser className="w-8 h-8 mr-2" />
        <span className="text-lg font-semibold text-cyan-400">Sakirin</span>
        <Bell className="w-8 h-5 ml-auto" />
        <LogOut className="w-8 h-5 ml-4" />
      </div>
      <div className="px-6">
        <SwitchTap />
      </div>
    </div>
     
  )
} 



export default SideBar;