import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, Filter, Calendar, Ticket } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useOrganizer } from '@/context/OrganizerContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function exportCsv(orders: any[]) {
  const headers = [
    'Order ID',
    'Buyer Name',
    'Event',
    'Ticket Type',
    'Quantity',
    'Amount Paid',
    'Payment Status',
    'Date',
  ];

  const rows = orders.map((order) => {
    const ticket = order.tickets[0];
    return [
      order.id,
      'Rahim Ahmed',
      order.event.title,
      ticket?.tier.name ?? '',
      order.tickets.length.toString(),
      order.finalAmount.toString(),
      order.paymentStatus,
      order.createdAt,
    ];
  });

  const csvContent = [headers, ...rows]
    .map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'organizer-orders.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function OrganizerOrders() {
  const { orders } = useOrganizer();

  const summary = useMemo(() => {
    const total = orders.reduce((sum, o) => sum + o.finalAmount, 0);
    const count = orders.length;
    return { total, count };
  }, [orders]);

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Orders</h1>
              <p className="text-gray-400 text-sm">
                View all ticket orders for your events and export reports.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-white/10 text-gray-300">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button
                variant="outline"
                className="border-white/10 text-gray-300"
                onClick={() => exportCsv(orders)}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="p-4 rounded-xl bg-dark-50 border border-white/5">
              <p className="text-xs text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-white mt-1">{summary.count}</p>
            </div>
            <div className="p-4 rounded-xl bg-dark-50 border border-white/5">
              <p className="text-xs text-gray-500">Gross Revenue</p>
              <p className="text-2xl font-bold text-cyan-400 mt-1">
                ৳{summary.total.toFixed(0)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-dark-50 border border-white/5">
              <p className="text-xs text-gray-500">Average Order Value</p>
              <p className="text-2xl font-bold text-white mt-1">
                ৳{summary.count ? (summary.total / summary.count).toFixed(0) : '0'}
              </p>
            </div>
          </motion.div>

          <div className="rounded-2xl bg-dark-50 border border-white/5 overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-gray-500 border-b border-white/5">
              <span className="col-span-2">Order ID</span>
              <span className="col-span-3">Buyer</span>
              <span className="col-span-3">Event</span>
              <span className="col-span-2">Amount</span>
              <span className="col-span-2 text-right">Status / Date</span>
            </div>
            <div className="divide-y divide-white/5">
              {orders.map((order) => {
                const ticket = order.tickets[0];
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 md:px-6 py-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
                  >
                    <div className="md:col-span-2 text-sm text-gray-300 font-mono">
                      {order.id.toUpperCase()}
                    </div>
                    <div className="md:col-span-3 text-sm text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold">
                        R
                      </div>
                      <div>
                        <p>Rahim Ahmed</p>
                        <p className="text-xs text-gray-500">+8801712345678</p>
                      </div>
                    </div>
                    <div className="md:col-span-3 text-sm text-gray-200">
                      <p className="line-clamp-1">{order.event.title}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Ticket className="w-3 h-3" />
                        {ticket?.tier.name} • {order.tickets.length} ticket
                        {order.tickets.length > 1 && 's'}
                      </p>
                    </div>
                    <div className="md:col-span-2 text-sm text-cyan-400">
                      ৳{order.finalAmount.toFixed(0)}
                    </div>
                    <div className="md:col-span-2 flex md:flex-col justify-between md:items-end items-center gap-1 text-xs">
                      <Badge
                        className={
                          order.paymentStatus === 'paid'
                            ? 'bg-green-500/20 text-green-400 border-0'
                            : 'bg-yellow-500/20 text-yellow-400 border-0'
                        }
                      >
                        {order.paymentStatus}
                      </Badge>
                      <span className="flex items-center gap-1 text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {order.createdAt.split('T')[0]}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
