import { useRef, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { LayoutDashboard, Calendar, Plus, Ticket, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useOrganizer } from '@/context/OrganizerContext';

// Organizer portal: only 3 links
const sidebarLinks = [
  { name: 'Dashboard', path: '/organizer', icon: LayoutDashboard },
  { name: 'Create Event', path: '/organizer/create-event', icon: Plus },
  { name: 'My Events', path: '/organizer/events', icon: Calendar },
];

export default function OrganizerDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const location = useLocation();
  const { user } = useAuth();
  const { events } = useOrganizer();

  const stats = useMemo(() => {
    const pending = events.filter(e => e.status === 'pending').length;
    const approved = events.filter(e => e.status === 'approved' || e.status === 'live').length;
    const total = events.length;
    return { pending, approved, total };
  }, [events]);

  const recentEvents = useMemo(() => {
    return [...events].slice(-5).reverse();
  }, [events]);

  const getStatusBadge = (status: string) => {
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
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                      ? 'bg-purple-500/20 text-purple-400'
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
          <div ref={containerRef} className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
            >
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400">Welcome back, {user?.name}! Manage your events here.</p>
              </div>
              <Link to="/organizer/create-event">
                <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </Link>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { title: 'Total Events', value: stats.total, icon: Ticket, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
                { title: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/20' },
                { title: 'Approved / Live', value: stats.approved, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-dark-50 border-white/5">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">{stat.title}</p>
                          <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                        </div>
                        <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                          <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Info Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="mb-8 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20"
            >
              <p className="text-purple-300 text-sm">
                📋 <strong>How it works:</strong> Create an event → It goes to Admin for approval → Once approved, it becomes live for users to view & book tickets.
              </p>
            </motion.div>

            {/* Recent Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-dark-50 border-white/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white font-semibold text-lg">Recent Events</h2>
                    <Link to="/organizer/events">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white text-xs">
                        View All
                      </Button>
                    </Link>
                  </div>
                  {recentEvents.length === 0 ? (
                    <div className="text-center py-10">
                      <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500">No events yet. Create your first event!</p>
                      <Link to="/organizer/create-event" className="mt-4 inline-block">
                        <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white mt-4">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Event
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentEvents.map((event) => (
                        <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{event.title}</p>
                            <p className="text-gray-500 text-xs">{event.date} • {event.venue}</p>
                          </div>
                          {getStatusBadge(event.status ?? 'draft')}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
