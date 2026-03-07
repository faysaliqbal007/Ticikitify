import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Plus, Calendar, Trash2, CheckCircle, XCircle, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Navbar from '@/components/Navbar';
import { useOrganizer } from '@/context/OrganizerContext';
import { toast } from 'sonner';
import type { Event } from '@/types';

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Create Event', path: '/admin/create-event', icon: Plus },
  { name: 'Manage Events', path: '/admin/events', icon: Calendar },
];

export default function AdminEvents() {
  const location = useLocation();
  const navigate = useNavigate();
  const { events, updateEventStatus, deleteEvent } = useOrganizer();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    updateEventStatus(id, 'approved');
    toast.success('Event approved!');
  };

  const handleReject = (id: string) => {
    updateEventStatus(id, 'rejected');
    toast.error('Event rejected.');
  };

  const getStatusBadge = (status: Event['status']) => {
    switch (status) {
      case 'pending': return <Badge className="bg-orange-500/20 text-orange-400 border-0">Pending</Badge>;
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

        <main className="flex-1 lg:ml-64 p-4 sm:p-8">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white">Manage Events</h1>
                  <p className="text-gray-400 text-sm mt-1">Approve, reject, or delete events from all organizers.</p>
                </div>
                <Link to="/admin/create-event">
                  <Button className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </Link>
              </div>
            </motion.div>

            {events.length === 0 ? (
              <div className="text-center py-16 rounded-2xl bg-dark-50 border border-dashed border-white/10">
                <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">No events yet</h2>
                <p className="text-gray-400 mb-4">Events from organizers will appear here.</p>
              </div>
            ) : (
              <div className="rounded-2xl bg-dark-50 border border-white/5 overflow-hidden">
                {/* Table header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-gray-500 border-b border-white/5">
                  <span className="col-span-4">Event</span>
                  <span className="col-span-2">Date</span>
                  <span className="col-span-2">By</span>
                  <span className="col-span-4 text-right">Actions</span>
                </div>
                <div className="divide-y divide-white/5">
                  {events.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-4 md:px-6 py-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                    >
                      <div className="md:col-span-4 flex items-start gap-3">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                        <div>
                          <p className="text-white font-medium line-clamp-2">{event.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(event.status)}
                            <span className="text-xs text-gray-500 capitalize">{event.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-2 text-sm text-gray-300">{event.date}</div>
                      <div className="md:col-span-2 text-sm text-gray-400 truncate">{event.organizer.name}</div>
                      <div className="md:col-span-4 flex justify-end gap-2 items-center flex-wrap">
                        {event.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              className="h-8 px-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-white border-0 text-xs"
                              onClick={() => handleApprove(event.id)}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              className="h-8 px-3 bg-gradient-to-r from-red-600 to-rose-500 text-white border-0 text-xs"
                              onClick={() => handleReject(event.id)}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-yellow-400 hover:text-yellow-300"
                          title="Edit event"
                          onClick={() => navigate(`/admin/edit-event/${event.id}`)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-400 hover:text-red-300"
                          onClick={() => { setEventToDelete(event.id); setDeleteDialogOpen(true); }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-dark-50 border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Event</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this event? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 text-gray-400 hover:text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (eventToDelete) { deleteEvent(eventToDelete); setEventToDelete(null); }
                setDeleteDialogOpen(false);
                toast.success('Event deleted.');
              }}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
