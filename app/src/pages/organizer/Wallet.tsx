import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ChevronLeft,
  ArrowUpRight,
  Download,
  Building2,
  Smartphone,
  History,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { transactions } from '@/data/mockData';
import Navbar from '@/components/Navbar';
import { useOrganizer } from '@/context/OrganizerContext';

export default function OrganizerWallet() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const { orders } = useOrganizer();

  const [withdrawnAmount, setWithdrawnAmount] = useState(0);
  const [requestedAmount, setRequestedAmount] = useState('');

  const { balance, pendingAmount } = useMemo(() => {
    const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');
    let netForOrganizer = 0;

    paidOrders.forEach((order) => {
      order.tickets.forEach((t) => {
        const price = t.tier.price;
        const commission = price * 0.1;
        const vatOnCommission = commission * 0.15;
        const organizerShare = price - commission - vatOnCommission;
        netForOrganizer += organizerShare;
      });
    });

    const pending = 0;

    return {
      balance: Math.max(netForOrganizer - withdrawnAmount, 0),
      pendingAmount: pending,
    };
  }, [withdrawnAmount]);

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />

      <main className="pt-24 pb-16">
        <div ref={containerRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link to="/organizer">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white mb-4">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-white">Wallet & Finance</h1>
          </motion.div>

          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-br from-purple-600 to-cyan-600 border-0">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <p className="text-white/70 mb-2">Available Balance</p>
                    <h2 className="text-4xl md:text-5xl font-bold text-white">
                      ৳{balance.toLocaleString()}
                    </h2>
                    <div className="flex gap-4 mt-4">
                      <div className="flex items-center gap-2 text-white/70">
                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                        <span className="text-sm">৳{pendingAmount.toLocaleString()} pending</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/70">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="text-sm">৳{withdrawnAmount.toLocaleString()} withdrawn</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-white/90"
                    onClick={() => {
                      const amount = parseFloat(requestedAmount || '0');
                      if (!amount || amount <= 0 || amount > balance) return;
                      setWithdrawnAmount((prev) => prev + amount);
                      setRequestedAmount('');
                    }}
                  >
                    <ArrowUpRight className="w-5 h-5 mr-2" />
                    Withdraw
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bank Details & Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          >
            {/* Bank Account */}
            <Card className="bg-dark-50 border-white/5">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-purple-500" />
                  Bank Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400">Bank Name</span>
                    <span className="text-white">Dutch-Bangla Bank</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400">Account Name</span>
                    <span className="text-white">Dhaka Events Ltd.</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Account Number</span>
                    <span className="text-white font-mono">•••• 4521</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 border-white/10">
                  Edit Bank Details
                </Button>
              </CardContent>
            </Card>

            {/* Mobile Wallet */}
            <Card className="bg-dark-50 border-white/5">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-cyan-500" />
                  bKash Merchant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400">Account Type</span>
                    <Badge className="bg-pink-500/20 text-pink-400 border-0">Merchant</Badge>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400">Account Name</span>
                    <span className="text-white">Dhaka Events Ltd.</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Number</span>
                    <span className="text-white font-mono">+880 17••••••89</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 border-white/10">
                  Edit bKash Details
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Transaction History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-dark-50 border-white/5">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-purple-500" />
                  Transaction History
                </CardTitle>
                <Button variant="outline" size="sm" className="border-white/10">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="w-full bg-white/5 mb-4">
                    <TabsTrigger value="all" className="flex-1 data-[state=active]:bg-purple-500">All</TabsTrigger>
                    <TabsTrigger value="credits" className="flex-1 data-[state=active]:bg-green-500">Credits</TabsTrigger>
                    <TabsTrigger value="debits" className="flex-1 data-[state=active]:bg-red-500">Debits</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-3">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                        <div>
                          <p className="text-white font-medium">{tx.eventName}</p>
                          <p className="text-sm text-gray-500">{tx.date}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'
                            }`}>
                            {tx.type === 'credit' ? '+' : '-'}৳{tx.netAmount.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            Commission: ৳{tx.commission}
                          </p>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="credits" className="space-y-3">
                    {transactions.filter(t => t.type === 'credit').map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                        <div>
                          <p className="text-white font-medium">{tx.eventName}</p>
                          <p className="text-sm text-gray-500">{tx.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-400">
                            +৳{tx.netAmount.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            Commission: ৳{tx.commission}
                          </p>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="debits" className="space-y-3">
                    {transactions.filter(t => t.type === 'debit').map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                        <div>
                          <p className="text-white font-medium">{tx.eventName}</p>
                          <p className="text-sm text-gray-500">{tx.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-400">
                            -৳{tx.netAmount.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            Fee: ৳{tx.commission}
                          </p>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
