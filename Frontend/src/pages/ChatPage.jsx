import React from 'react';
import{useLocation} from "react-router-dom";
import SideBar from '../components/sidebar/SideBar';

const ChatPage = () => {
  const location = useLocation();
  const { name, email, number } = location.state || {};
  return (
    <div className = "flex h-screen w-full overflow-hidden">
      <SideBar/>
      <main className="flex-1 min-w-0 p-6 bg-red-500 overflow-y-auto">
        <h1 className="text-2xl font-bold">Welcome to the Chat Page</h1>
      </main>
    </div>
  )
}

export default ChatPage;