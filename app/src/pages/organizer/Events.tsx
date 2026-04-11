import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Edit2, Trash2, LayoutDashboard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Navbar from '@/components/Navbar';
import { useOrganizer } from '@/context/OrganizerContext';

const sidebarLinks = [
  { name: 'Dashboard', path: '/organizer', icon: LayoutDashboard },
  { name: 'Create Event', path: '/organizer/create-event', icon: Plus },
  { name: 'My Events', path: '/organizer/events', icon: Calendar },
  { name: 'Promo Codes', path: '/organizer/promo-codes', icon: Calendar },
];

export default function OrganizerEvents() {
  const navigate = useNavigate();
  const { events, deleteEvent } = useOrganizer();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const location = { pathname: '/organizer/events' };  // for sidebar active state

  const eventStats = useMemo(() => {
    return events.map((event) => {
      return { event, ticketsSold: 0, revenue: 0 };
    });
  }, [events]);

  const getStatusBadge = (status: typeof events[0]['status']) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-green-500/20 text-green-400 border-0">Live</Badge>;
      case 'draft':
        return <Badge className="bg-gray-500/20 text-gray-300 border-0">Draft</Badge>;
      case 'scheduled':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-0">Scheduled</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500/20 text-red-400 border-0">Cancelled</Badge>;
      case 'pending':
        return <Badge className="bg-orange-500/20 text-orange-400 border-0">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-blue-500/20 text-blue-400 border-0">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400 border-0">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="border-white/10 text-gray-400 capitalize">{status}</Badge>;
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">Organizer</p>
                <p className="text-xs text-gray-500">Portal</p>
              </div>
            </div>
            <nav className="space-y-1">
              {sidebarLinks.map((link) => {
                const isActive = link.path === location.pathname;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'
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

        <main className="flex-1 lg:ml-64 pt-8 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">My Events</h1>
              <p className="text-gray-400 text-sm">
                Manage all your published, draft, and scheduled events in one place.
              </p>
            </div>
            <Link to="/organizer/create-event">
              <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
                Create New Event
              </Button>
            </Link>
          </div>

          {eventStats.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-dark-50 border border-dashed border-white/10">
              <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">No events yet</h2>
              <p className="text-gray-400 mb-4">
                Start by creating your first event. It will appear here once saved.
              </p>
              <Link to="/organizer/create-event">
                <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
                  Create Event
                </Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl bg-dark-50 border border-white/5 overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-gray-500 border-b border-white/5">
                <span className="col-span-3">Event</span>
                <span className="col-span-2">Date</span>
                <span className="col-span-2">Tickets Sold</span>
                <span className="col-span-2">Revenue</span>
                <span className="col-span-3 text-right">Actions</span>
              </div>
              <div className="divide-y divide-white/5">
                {eventStats.map(({ event, ticketsSold, revenue }) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 md:px-6 py-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                  >
                    <div className="md:col-span-3 flex items-start gap-3">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                      />
                      <div>
                        <p className="text-white font-medium line-clamp-2">{event.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(event.status)}
                          {event.isTrending && <Badge className="bg-purple-500/20 text-purple-400 border-0">Trending</Badge>}
                          <span className="text-xs text-gray-500 capitalize">{event.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2 text-sm text-gray-300">
                      {event.date}{' '}
                      <span className="block text-xs text-gray-500">{event.time}</span>
                    </div>
                    <div className="md:col-span-2 text-sm text-gray-300">
                      {ticketsSold}
                    </div>
                    <div className="md:col-span-2 text-sm text-cyan-400">
                      ৳{revenue.toFixed(0)}
                    </div>
                    <div className="md:col-span-3 flex justify-end gap-2 items-center flex-wrap">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-yellow-400 hover:text-yellow-300"
                        title="Edit event"
                        onClick={() => navigate(`/organizer/edit-event/${event.id}`)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-400 hover:text-red-300"
                        title="Delete event"
                        onClick={() => {
                          setEventToDelete(event.id);
                          setDeleteDialogOpen(true);
                        }}
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
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 text-gray-400 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (eventToDelete) {
                  deleteEvent(eventToDelete);
                  setEventToDelete(null);
                }
                setDeleteDialogOpen(false);
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


