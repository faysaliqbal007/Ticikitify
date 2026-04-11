import { useRef, useMemo, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { LayoutDashboard, Calendar, Plus, Ticket, Clock, CheckCircle, TrendingUp, Package, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useOrganizer } from '@/context/OrganizerContext';
import { apiGetOrganizerStats } from '@/lib/api';

const sidebarLinks = [
  { name: 'Dashboard', path: '/organizer', icon: LayoutDashboard },
  { name: 'Create Event', path: '/organizer/create-event', icon: Plus },
  { name: 'My Events', path: '/organizer/events', icon: Calendar },
  { name: 'Promo Codes', path: '/organizer/promo-codes', icon: Ticket },
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

  const [orgStats, setOrgStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiGetOrganizerStats()
      .then(setOrgStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
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
          <div ref={containerRef} className="max-w-5xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
            >
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400">Welcome back, {user?.name}! Track your event performance.</p>
              </div>
              <Link to="/organizer/create-event">
                <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </Link>
            </motion.div>

            {/* Revenue Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { title: 'Total Revenue', value: orgStats ? `৳${orgStats.totalRevenue.toLocaleString()}` : '—', icon: Coins, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
                { title: 'Tickets Sold', value: orgStats ? orgStats.totalTicketsSold : '—', icon: Ticket, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
                { title: 'Remaining', value: orgStats ? orgStats.totalTicketsRemaining.toLocaleString() : '—', icon: Package, color: 'text-orange-400', bg: 'bg-orange-500/20' },
                { title: 'Profit (~90%)', value: orgStats ? `৳${Math.round(orgStats.totalRevenue * 0.9).toLocaleString()}` : '—', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/20' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-dark-50 border-white/5">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                          <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                      </div>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-gray-500 text-xs mt-1">{stat.title}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Event Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { title: 'Total Events', value: stats.total, icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/20' },
                { title: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/20' },
                { title: 'Approved / Live', value: stats.approved, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card className="bg-dark-50 border-white/5">
                    <CardContent className="p-5">
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

            {/* My Events Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-dark-50 border-white/5">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    My Events Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-10 text-gray-500">
                      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p>Loading event data...</p>
                    </div>
                  ) : !orgStats?.eventMetrics || orgStats.eventMetrics.length === 0 ? (
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
                    <div className="space-y-4">
                      {orgStats.eventMetrics.map((event: any) => {
                        const totalCapacity = event.sold + event.remaining;
                        const soldPercent = totalCapacity > 0 ? Math.round((event.sold / totalCapacity) * 100) : 0;
                        return (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row items-start gap-4">
                              <img
                                src={event.image || '/placeholder-event.png'}
                                alt={event.title}
                                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0 w-full">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-white font-semibold truncate">{event.title}</p>
                                  {getStatusBadge(event.status ?? 'draft')}
                                </div>
                                <p className="text-gray-500 text-sm mb-3">{event.date} • {event.venue}</p>

                                {/* Progress Bar */}
                                <div className="w-full bg-white/10 rounded-full h-2.5 mb-2">
                                  <div
                                    className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${soldPercent}%` }}
                                  />
                                </div>
                                <p className="text-gray-500 text-xs mb-3">{soldPercent}% sold ({event.sold} / {totalCapacity})</p>

                                <div className="flex items-center gap-3 flex-wrap">
                                  <Badge className="bg-emerald-500/10 text-emerald-400 border-0">
                                    Revenue: ৳{event.revenue.toLocaleString()}
                                  </Badge>
                                  <Badge className="bg-cyan-500/10 text-cyan-400 border-0">
                                    Sold: {event.sold}
                                  </Badge>
                                  <Badge className="bg-orange-500/10 text-orange-400 border-0">
                                    Remaining: {event.remaining}
                                  </Badge>
                                  <Badge className="bg-purple-500/10 text-purple-400 border-0">
                                    Profit: ৳{Math.round(event.revenue * 0.9).toLocaleString()}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
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
