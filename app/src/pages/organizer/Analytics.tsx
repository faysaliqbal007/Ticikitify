import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Download } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useOrganizer } from '@/context/OrganizerContext';
import { events as allEvents } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function OrganizerAnalytics() {
  const { orders } = useOrganizer();
  const [selectedEventId, setSelectedEventId] = useState<string | 'all'>('all');

  const filteredOrders = useMemo(
    () =>
      orders.filter(
        (o) => selectedEventId === 'all' || o.event.id === selectedEventId,
      ),
    [selectedEventId],
  );

  const revenueByDate = useMemo(() => {
    const map = new Map<string, number>();
    filteredOrders.forEach((o) => {
      const day = o.createdAt.split('T')[0];
      map.set(day, (map.get(day) || 0) + o.finalAmount);
    });
    return Array.from(map.entries()).map(([date, revenue]) => ({ date, revenue }));
  }, [filteredOrders]);

  const ticketsByTier = useMemo(() => {
    const map = new Map<string, number>();
    filteredOrders.forEach((o) => {
      o.tickets.forEach((t) => {
        const key = t.tier.name;
        map.set(key, (map.get(key) || 0) + 1);
      });
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [filteredOrders]);

  const ticketsByCity = useMemo(() => {
    const map = new Map<string, number>();
    filteredOrders.forEach((o) => {
      const key = o.event.city;
      map.set(key, (map.get(key) || 0) + o.tickets.length);
    });
    return Array.from(map.entries()).map(([city, count]) => ({ city, count }));
  }, [filteredOrders]);

  const totalVisits = 1000;
  const totalPurchases = filteredOrders.length;
  const conversionRate = totalVisits ? (totalPurchases / totalVisits) * 100 : 0;

  const colors = ['#6C63FF', '#00F0FF', '#F7931E', '#E2136E', '#22C55E'];

  const exportAnalyticsCsv = () => {
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Orders', filteredOrders.length.toString()],
      [
        'Total Revenue',
        filteredOrders.reduce((sum, o) => sum + o.finalAmount, 0).toFixed(2),
      ],
      ['Conversion Rate', `${conversionRate.toFixed(2)}%`],
    ];
    const csvContent = [headers, ...rows]
      .map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'organizer-analytics.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Analytics</h1>
              <p className="text-gray-400 text-sm">
                Deep-dive into revenue, ticket sales and performance by event.
              </p>
            </div>
            <div className="flex gap-2">
              <Select
                value={selectedEventId}
                onValueChange={(v) => setSelectedEventId(v as typeof selectedEventId)}
              >
                <SelectTrigger className="w-40 bg-dark-50 border-white/10 text-gray-200">
                  <SelectValue placeholder="Filter by event" />
                </SelectTrigger>
                <SelectContent className="bg-dark-50 border-white/10 text-gray-200">
                  <SelectItem value="all">All Events</SelectItem>
                  {allEvents
                    .filter((e) => e.organizer.id === 'org1')
                    .map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-white/10 text-gray-300"
                onClick={exportAnalyticsCsv}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="p-4 rounded-xl bg-dark-50 border border-white/5">
              <p className="text-xs text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-cyan-400 mt-1">
                ৳
                {filteredOrders
                  .reduce((sum, o) => sum + o.finalAmount, 0)
                  .toFixed(0)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-dark-50 border border-white/5">
              <p className="text-xs text-gray-500">Tickets Sold</p>
              <p className="text-2xl font-bold text-white mt-1">
                {filteredOrders.reduce((sum, o) => sum + o.tickets.length, 0)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-dark-50 border border-white/5">
              <p className="text-xs text-gray-500">Conversion Rate</p>
              <p className="text-2xl font-bold text-white mt-1">
                {conversionRate.toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 rounded-2xl bg-dark-50 border border-white/5 p-4"
            >
              <h2 className="text-sm font-semibold text-white mb-2">Revenue by Date</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueByDate}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #333',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#6C63FF"
                      strokeWidth={2}
                      dot={{ fill: '#6C63FF' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-dark-50 border border-white/5 p-4"
            >
              <h2 className="text-sm font-semibold text-white mb-2">Tickets by Tier</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ticketsByTier}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #333',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#00F0FF" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-dark-50 border border-white/5 p-4"
            >
              <h2 className="text-sm font-semibold text-white mb-2">Sales by City</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ticketsByCity}
                      dataKey="count"
                      nameKey="city"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      {ticketsByCity.map((_, index) => (
                        <Cell
                          key={index}
                          fill={colors[index % colors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #333',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-dark-50 border border-white/5 p-4"
            >
              <h2 className="text-sm font-semibold text-white mb-2">Quick Summary</h2>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  • Total events analyzed:{' '}
                  <span className="text-white">
                    {new Set(filteredOrders.map((o) => o.event.id)).size}
                  </span>
                </li>
                <li>
                  • Best-performing city:{' '}
                  <span className="text-white">
                    {ticketsByCity[0]?.city ?? 'N/A'}
                  </span>
                </li>
                <li>
                  • Most popular tier:{' '}
                  <span className="text-white">
                    {ticketsByTier[0]?.name ?? 'N/A'}
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}


