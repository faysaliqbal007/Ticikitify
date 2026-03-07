import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Plus, Calendar, Users as UsersIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { apiGetAllUsers } from '@/lib/api';

// Temporary inline interface since it's missing from types/index.ts
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'organizer' | 'admin';
  avatar: string;
  createdAt: string;
}

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Create Event', path: '/admin/create-event', icon: Plus },
  { name: 'Manage Events', path: '/admin/events', icon: Calendar },
  { name: 'Manage Users', path: '/admin/users', icon: UsersIcon },
];

export default function AdminUsers() {
  const location = useLocation();
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiGetAllUsers();
        setUsersList(data);
      } catch (err) {
        console.error('Failed to fetch users', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const customers = usersList.filter(u => u.role === 'customer');
  const organizers = usersList.filter(u => u.role === 'organizer');

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 fixed h-full bg-dark-50 border-r border-white/5">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">Admin</p>
                <p className="text-xs text-gray-500">Control Panel</p>
              </div>
            </div>
            <nav className="space-y-1">
              {sidebarLinks.map((link) => {
                const isActive = location.pathname.includes(link.path) && link.path !== '/admin' || location.pathname === link.path && link.path === '/admin';
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                      ? 'bg-red-500/20 text-red-400'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-4 sm:p-8">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="text-3xl font-bold text-white">Manage Users</h1>
              <p className="text-gray-400">View and manage all registered customers and event organizers.</p>
            </motion.div>

            {isLoading ? (
              <div className="col-span-full py-12 flex justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Customers Block */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <UsersIcon className="w-5 h-5 text-cyan-400" />
                    Customers ({customers.length})
                  </h2>
                  <div className="space-y-4">
                    {customers.length === 0 ? (
                      <p className="text-gray-500 text-sm">No customers registered yet.</p>
                    ) : (
                      customers.map(cust => (
                        <div key={cust.id} className="p-4 rounded-xl bg-dark-50 border border-white/5 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                            {cust.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-medium">{cust.name}</p>
                            <p className="text-gray-400 text-xs">{cust.email}</p>
                          </div>
                          <Badge className="ml-auto bg-white/10 text-gray-300">Customer</Badge>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Organizers Block */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-purple-400" />
                    Organizers ({organizers.length})
                  </h2>
                  <div className="space-y-4">
                    {organizers.length === 0 ? (
                      <p className="text-gray-500 text-sm">No organizers registered yet.</p>
                    ) : (
                      organizers.map(org => (
                        <div key={org.id} className="p-4 rounded-xl bg-dark-50 border border-white/5 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                            {org.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-medium">{org.name}</p>
                            <p className="text-gray-400 text-xs">{org.email}</p>
                          </div>
                          <Badge className="ml-auto bg-purple-500/20 text-purple-400 hover:bg-purple-500/20 border-0">Organizer</Badge>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
}
