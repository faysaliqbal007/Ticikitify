import { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Plus, Calendar, CheckCircle,
  XCircle, Clock, Trash2, Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';
import { useOrganizer } from '@/context/OrganizerContext';
import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventsContext';
import { toast } from 'sonner';
import type { Event } from '@/types';

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Create Event', path: '/admin/create-event', icon: Plus },
  { name: 'Manage Events', path: '/admin/events', icon: Calendar },
];

export default function AdminDashboard() {
  const location = useLocation();
  const { user } = useAuth();
  const { events, updateEventStatus, deleteEvent } = useOrganizer();

  const pendingEvents = events.filter(e => e.status === 'pending');
  const approvedEvents = events.filter(e => e.status === 'approved' || e.status === 'live');
  const totalEvents = events.length;

  const handleApprove = (id: string) => {
    updateEventStatus(id, 'approved');
    toast.success('Event approved successfully!');
  };

  const handleReject = (id: string) => {
    updateEventStatus(id, 'rejected');
    toast.error('Event rejected.');
  };

  const handleDelete = (id: string) => {
    deleteEvent(id);
    toast.success('Event deleted.');
  };

  const getStatusBadge = (status: Event['status']) => {
    switch (status) {
      case 'pending': return <Badge className="bg-orange-500/20 text-orange-400 border-0">Pending Review</Badge>;
      case 'approved': return <Badge className="bg-blue-500/20 text-blue-400 border-0">Approved</Badge>;
      case 'live': return <Badge className="bg-green-500/20 text-green-400 border-0">Live</Badge>;
      case 'rejected': return <Badge className="bg-red-500/20 text-red-400 border-0">Rejected</Badge>;
      case 'draft': return <Badge className="bg-gray-500/20 text-gray-400 border-0">Draft</Badge>;
      default: return <Badge variant="outline" className="border-white/10 text-gray-400 capitalize">{status}</Badge>;
    }
  };

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
                const isActive = location.pathname === link.path;
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
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400">Welcome, {user?.name}. Manage events and review organizer submissions.</p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Total Events', value: totalEvents, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
                { label: 'Pending Review', value: pendingEvents.length, color: 'text-orange-400', bg: 'bg-orange-500/20' },
                { label: 'Approved / Live', value: approvedEvents.length, color: 'text-green-400', bg: 'bg-green-500/20' },
              ].map((stat) => (
                <Card key={stat.label} className="bg-dark-50 border-white/5">
                  <CardContent className="p-6 text-center">
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3 mb-8">
              <Link to="/admin/create-event">
                <Button className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </Link>
              <Link to="/admin/events">
                <Button variant="outline" className="border-white/10 text-gray-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  All Events
                </Button>
              </Link>
            </div>

            {/* Pending Events for Review */}
            <Card className="bg-dark-50 border-white/5">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-400" />
                  Pending Organizer Events ({pendingEvents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingEvents.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No events pending review. You're all caught up!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-white/5 border border-orange-500/20"
                      >
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold truncate">{event.title}</p>
                          <p className="text-gray-400 text-sm">{event.date} • {event.venue}, {event.city}</p>
                          <p className="text-gray-500 text-xs mt-1">By: {event.organizer.name}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {getStatusBadge(event.status)}
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white border-0 text-xs"
                            onClick={() => handleApprove(event.id)}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-red-600 to-rose-500 text-white border-0 text-xs"
                            onClick={() => handleReject(event.id)}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-400 hover:text-red-300"
                            onClick={() => handleDelete(event.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
