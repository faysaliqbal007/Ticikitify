import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Plus, Calendar, CheckCircle,
  XCircle, Clock, Trash2, TrendingUp, Ticket, Package, Coins, Users, Percent, Tag, Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { useOrganizer } from '@/context/OrganizerContext';
import { useAuth } from '@/context/AuthContext';
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
  const totalEvents = events.length;

  const [adminStats, setAdminStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [promoCodes, setPromoCodes] = useState<any[]>([]);

  // Promo Code Creation State
  const [isSubmittingPromo, setIsSubmittingPromo] = useState(false);
  const [promoForm, setPromoForm] = useState({
    code: '',
    discountValue: '',
    expiryDate: '',
    usageLimit: '',
    minimumOrderAmount: '',
    isGlobal: true,
  });

  useEffect(() => {
    setLoading(true);
    import('@/lib/api').then(({ apiGetAdminStats, apiGetPromoCodes }) => {
       Promise.all([
          apiGetAdminStats(),
          apiGetPromoCodes()
       ])
       .then(([stats, promos]) => {
          setAdminStats(stats);
          setPromoCodes(promos || []);
       })
       .catch(console.error)
       .finally(() => setLoading(false));
    });
  }, []);

  const handleDeletePromoCode = (id: string) => {
      if(confirm('Are you sure you want to delete this promo code?')) {
        import('@/lib/api').then(({ apiDeletePromoCode }) => {
           apiDeletePromoCode(id).then(() => {
              setPromoCodes(prev => prev.filter(p => p._id !== id && p.id !== id));
              toast.success('Promo code deleted');
           }).catch((e) => toast.error(e.message || 'Failed to delete'));
        });
    }
  };

  const handleTogglePromoStatus = async (promo: any) => {
    try {
      const { apiUpdatePromoCode } = await import('@/lib/api');
      const updatedPromo = await apiUpdatePromoCode(promo._id || promo.id, { isActive: !promo.isActive });
      
      const matchId = updatedPromo._id || updatedPromo.id;
      setPromoCodes(prev => prev.map(p => {
         const pId = p._id || p.id;
         return pId === matchId ? updatedPromo : p;
      }));
      toast.success(`Promo code ${updatedPromo.isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch(err: any) {
      toast.error(err.message || 'Failed to update promo status');
    }
  };

  const handleCreatePromoCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoForm.code || !promoForm.discountValue || !promoForm.expiryDate) return;
    setIsSubmittingPromo(true);
    try {
      const { apiCreatePromoCode } = await import('@/lib/api');
      const newPromo = await apiCreatePromoCode({
         code: promoForm.code.toUpperCase(),
         discountType: 'percentage',
         discountValue: Number(promoForm.discountValue),
         expiryDate: promoForm.expiryDate,
         usageLimit: Number(promoForm.usageLimit) || undefined,
         minimumOrderAmount: Number(promoForm.minimumOrderAmount) || undefined,
         isActive: true,
         isGlobal: promoForm.isGlobal
      });
      setPromoCodes(prev => [newPromo, ...prev]);
      setPromoForm({
        code: '',
        discountValue: '',
        expiryDate: '',
        usageLimit: '',
        minimumOrderAmount: '',
        isGlobal: true,
      });
      toast.success('Promo code created successfully!');
    } catch(err: any) {
      toast.error(err.message || 'Failed to create promo code');
    } finally {
      setIsSubmittingPromo(false);
    }
  };

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

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-4 sm:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400">Welcome, {user?.name}. Full platform overview and management.</p>
            </motion.div>

            {/* Platform Financial Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {[
                { title: 'Platform Profit', value: adminStats ? `৳${Math.round(adminStats.platformProfit).toLocaleString()}` : '—', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/20' },
                { title: 'Total Revenue', value: adminStats ? `৳${adminStats.totalRevenue.toLocaleString()}` : '—', icon: Coins, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
                { title: 'Tickets Sold', value: adminStats ? adminStats.totalSales : '—', icon: Ticket, color: 'text-blue-400', bg: 'bg-blue-500/20' },
                { title: 'Remaining', value: adminStats ? adminStats.totalRemainingPlatform.toLocaleString() : '—', icon: Package, color: 'text-amber-400', bg: 'bg-amber-500/20' },
                { title: 'Total Events', value: totalEvents, icon: Calendar, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
                { title: 'Pending', value: pendingEvents.length, icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/20' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-dark-50 border-white/5 h-full">
                    <CardContent className="p-4">
                      <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      </div>
                      <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{stat.title}</p>
                    </CardContent>
                  </Card>
                </motion.div>
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

            {/* Organizer Performance Table */}
            {adminStats?.organizerMetrics && adminStats.organizerMetrics.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mb-8"
              >
                <Card className="bg-dark-50 border-white/5">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-400" />
                      Organizer Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="py-3 px-4 text-left text-gray-400 font-medium">Organizer</th>
                            <th className="py-3 px-4 text-left text-gray-400 font-medium">Email</th>
                            <th className="py-3 px-4 text-right text-gray-400 font-medium">Tickets Sold</th>
                            <th className="py-3 px-4 text-right text-gray-400 font-medium">Revenue</th>
                            <th className="py-3 px-4 text-right text-gray-400 font-medium">Platform Cut (10%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminStats.organizerMetrics.map((org: any, i: number) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="py-3 px-4 text-white font-medium">{org.name}</td>
                              <td className="py-3 px-4 text-gray-400">{org.email}</td>
                              <td className="py-3 px-4 text-right text-cyan-400 font-semibold">{org.ticketsSold}</td>
                              <td className="py-3 px-4 text-right text-emerald-400 font-semibold">৳{org.revenue.toLocaleString()}</td>
                              <td className="py-3 px-4 text-right text-purple-400 font-semibold">৳{Math.round(org.revenue * 0.1).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Promo Codes Table */}
            {promoCodes && promoCodes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <Card className="bg-dark-50 border-white/5">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Percent className="w-5 h-5 text-purple-400" />
                      Platform Promo Codes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    
                    {/* Create Promo Code Form */}
                    <form onSubmit={handleCreatePromoCode} className="mb-8 rounded-2xl bg-dark-50 border border-white/5 p-6 space-y-4">
                      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Tag className="w-5 h-5 text-purple-400" />
                        Create New Promo Code
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Code</Label>
                          <div className="relative mt-1">
                            <Hash className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <Input 
                              value={promoForm.code} 
                              onChange={(e) => setPromoForm({...promoForm, code: e.target.value})} 
                              placeholder="TICIKITIFY50" 
                              className="pl-9 bg-white/5 border-white/10 text-white" 
                              required 
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-gray-400">Discount Value (%)</Label>
                          <div className="relative mt-1">
                            <Percent className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <Input 
                              type="number" min="1" max="100" 
                              value={promoForm.discountValue} 
                              onChange={(e) => setPromoForm({...promoForm, discountValue: e.target.value})} 
                              placeholder="10" 
                              className="pl-9 bg-white/5 border-white/10 text-white" 
                              required 
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-gray-400">Expiry Date</Label>
                          <div className="relative mt-1">
                            <Calendar className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <Input 
                              type="date" 
                              value={promoForm.expiryDate} 
                              onChange={(e) => setPromoForm({...promoForm, expiryDate: e.target.value})} 
                              className="pl-9 bg-white/5 border-white/10 text-white" 
                              required 
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-gray-400">Usage Limit (optional)</Label>
                          <Input 
                            type="number" 
                            value={promoForm.usageLimit} 
                            onChange={(e) => setPromoForm({...promoForm, usageLimit: e.target.value})} 
                            placeholder="e.g., 100" 
                            className="bg-white/5 border-white/10 text-white mt-1" 
                          />
                        </div>
                        <div>
                          <Label className="text-gray-400">Minimum Tickets (optional)</Label>
                          <Input 
                            type="number" 
                            value={promoForm.minimumOrderAmount} 
                            onChange={(e) => setPromoForm({...promoForm, minimumOrderAmount: e.target.value})} 
                            placeholder="e.g., 2" 
                            className="bg-white/5 border-white/10 text-white mt-1" 
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/5">
                        <label className="flex items-center gap-2 cursor-pointer">
                           <input 
                              type="checkbox" 
                              checked={promoForm.isGlobal} 
                              onChange={(e) => setPromoForm({...promoForm, isGlobal: e.target.checked})} 
                              className="w-4 h-4 rounded bg-dark-50 border-white/10 text-purple-500 focus:ring-purple-500/20"
                           />
                           <span className="text-sm text-gray-300">Global Code (Applies to all platform events)</span>
                        </label>
                        <div className="flex gap-3">
                            <Button variant="ghost" type="button" onClick={() => {
                                setPromoForm({
                                  code: '',
                                  discountValue: '',
                                  expiryDate: '',
                                  usageLimit: '',
                                  minimumOrderAmount: '',
                                  isGlobal: true,
                                });
                            }} className="text-gray-400 hover:text-white" disabled={isSubmittingPromo}>
                              Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmittingPromo || !promoForm.code || !promoForm.discountValue || !promoForm.expiryDate} className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white border-0">
                               {isSubmittingPromo ? 'Creating...' : 'Create Code'}
                            </Button>
                        </div>
                      </div>
                    </form>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="py-3 px-4 text-left text-gray-400 font-medium">Code</th>
                            <th className="py-3 px-4 text-left text-gray-400 font-medium">Discount</th>
                            <th className="py-3 px-4 text-right text-gray-400 font-medium">Uses / Limit</th>
                            <th className="py-3 px-4 text-right text-gray-400 font-medium">Status</th>
                            <th className="py-3 px-4 text-right text-gray-400 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {promoCodes.map((promo: any, i: number) => {
                            const isExpired = new Date(promo.expiryDate) < new Date();
                            const status = promo.isActive && !isExpired ? 'Active' : isExpired ? 'Expired' : 'Inactive';
                            const statusColor = status === 'Active' ? 'text-green-400' : status === 'Expired' ? 'text-orange-400' : 'text-gray-400';
                            return (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                  <td className="py-3 px-4 text-white font-medium">
                                    <div className="flex items-center gap-2">
                                      {promo.code}
                                      {promo.isGlobal ? (
                                        <Badge className="bg-blue-500/10 text-blue-400 border-0 text-[10px]">Global</Badge>
                                      ) : (
                                        <Badge className="bg-purple-500/10 text-purple-400 border-0 text-[10px]">Private</Badge>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-cyan-400">
                                     {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `৳${promo.discountValue}`}
                                  </td>
                                  <td className="py-3 px-4 text-right text-gray-300">
                                      {promo.usageCount} / {promo.usageLimit || '∞'}
                                  </td>
                                  <td className={`py-3 px-4 text-right font-medium ${statusColor}`}>{status}</td>
                                  <td className="py-3 px-4 text-right flex justify-end items-center gap-4">
                                    <button
                                      type="button"
                                      onClick={() => handleTogglePromoStatus(promo)}
                                      title={promo.isActive ? "Active (Click to Disable)" : "Inactive (Click to Enable)"}
                                      className={`w-10 h-5 rounded-full flex items-center px-1 transition ${promo.isActive && !isExpired
                                          ? 'bg-green-500'
                                          : 'bg-white/10'
                                        }`}
                                    >
                                      <span
                                        className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${promo.isActive && !isExpired ? 'translate-x-5' : ''
                                          }`}
                                      />
                                    </button>

                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                      onClick={() => handleDeletePromoCode(promo._id || promo.id)}
                                      title="Delete Code"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </td>
                                </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Pending Events for Review */}
            <Card className="bg-dark-50 border-white/5 mb-8">
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

            {/* All Events Performance */}
            <Card className="bg-dark-50 border-white/5">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  All Events Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-10 text-gray-500">
                    <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p>Loading platform data...</p>
                  </div>
                ) : !adminStats?.eventMetrics || adminStats.eventMetrics.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <p>No events found on the platform.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {adminStats.eventMetrics.map((event: any) => {
                      const totalCapacity = event.sold + event.remaining;
                      const soldPercent = totalCapacity > 0 ? Math.round((event.sold / totalCapacity) * 100) : 0;
                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row items-start gap-4">
                            <img
                              src={event.image || '/placeholder-event.png'}
                              alt={event.title}
                              className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0 w-full">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <p className="text-white font-semibold">{event.title}</p>
                                <Badge className={`border-0 text-xs ${event.status === 'live' ? 'bg-green-500/20 text-green-400' : event.status === 'pending' ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                  {event.status}
                                </Badge>
                              </div>
                              <p className="text-gray-500 text-sm mb-1">By {event.organizerName}</p>
                              <p className="text-gray-600 text-xs mb-3">{event.date} • {event.venue}</p>

                              {/* Progress Bar */}
                              <div className="w-full bg-white/10 rounded-full h-2.5 mb-1.5">
                                <div
                                  className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
                                  style={{ width: `${soldPercent}%` }}
                                />
                              </div>
                              <p className="text-gray-500 text-xs mb-3">
                                {soldPercent}% sold • <span className="text-cyan-400">{event.sold}</span> sold / <span className="text-orange-400">{event.remaining}</span> remaining / <span className="text-white">{totalCapacity}</span> total
                              </p>

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
                                  Platform Cut: ৳{Math.round(event.revenue * 0.1).toLocaleString()}
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
          </div>
        </main>
      </div>
    </div>
  );
}
