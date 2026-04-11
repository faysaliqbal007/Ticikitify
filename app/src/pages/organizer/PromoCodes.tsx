import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag, Plus, Calendar, Percent, Hash, Trash2, LayoutDashboard, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { useOrganizer } from '@/context/OrganizerContext';
import type { PromoCode } from '@/types';

const sidebarLinks = [
  { name: 'Dashboard', path: '/organizer', icon: LayoutDashboard },
  { name: 'Create Event', path: '/organizer/create-event', icon: Plus },
  { name: 'My Events', path: '/organizer/events', icon: Calendar },
  { name: 'Promo Codes', path: '/organizer/promo-codes', icon: Ticket },
];

export default function OrganizerPromoCodes() {
  const location = useLocation();
  const { promoCodes, addPromoCode, updatePromoCode, deletePromoCode } = useOrganizer();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    discountValue: '',
    expiryDate: '',
    usageLimit: '',
    minimumOrderAmount: ''
  });

  const canSubmit = formData.code && formData.discountValue && formData.expiryDate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    
    try {
        if (editingCode) {
          await updatePromoCode(editingCode.id, {
            code: formData.code.toUpperCase(),
            discountType: 'percentage',
            discountValue: Math.min(Math.max(Number(formData.discountValue), 1), 100),
            expiryDate: formData.expiryDate,
            usageLimit: Number(formData.usageLimit) || undefined,
            minimumOrderAmount: Number(formData.minimumOrderAmount) || undefined,
          });
        } else {
          await addPromoCode({
            code: formData.code.toUpperCase(),
            discountType: 'percentage',
            discountValue: Math.min(Math.max(Number(formData.discountValue), 1), 100),
            expiryDate: formData.expiryDate,
            usageLimit: Number(formData.usageLimit) || undefined,
            minimumOrderAmount: Number(formData.minimumOrderAmount) || undefined,
            isActive: true,
          });
        }
        setEditingCode(null);
        setFormData({
          code: '',
          discountValue: '',
          expiryDate: '',
          usageLimit: '',
          minimumOrderAmount: ''
        });
    } catch(err: any) {
        alert(err.message || "Failed to process promo code.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const isExpired = (promo: PromoCode) => {
    return new Date(promo.expiryDate) < new Date();
  };

  const remainingUses = (promo: PromoCode) => {
    if (promo.usageLimit == null) return '∞';
    return Math.max(promo.usageLimit - promo.usageCount, 0);
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

        <main className="flex-1 lg:ml-64 p-4 sm:p-8">
          <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Promo Codes</h1>
            <p className="text-gray-400 text-sm">
              Create discount codes with usage limits, expiry, and minimum order amounts.
            </p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="mb-8 rounded-2xl bg-dark-50 border border-white/5 p-6 space-y-4"
          >
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
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="TICIKITIFY50"
                    className="pl-9 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div>
                <Label className="text-gray-400">Discount Value (%)</Label>
                <div className="relative mt-1">
                  <Percent className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                    placeholder="10"
                    className="pl-9 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div>
                <Label className="text-gray-400">Expiry Date</Label>
                <div className="relative mt-1">
                  <Calendar className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    className="pl-9 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div>
                <Label className="text-gray-400">Usage Limit (optional)</Label>
                <Input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                  placeholder="e.g., 100"
                  className="mt-1 bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-400">Minimum Tickets (optional)</Label>
                <Input 
                  type="number" 
                  value={formData.minimumOrderAmount} 
                  onChange={(e) => setFormData({...formData, minimumOrderAmount: e.target.value})} 
                  placeholder="e.g., 2" 
                  className="bg-dark-50 border-white/10 text-white mt-1" 
                />
              </div>
            </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="ghost" type="button" onClick={() => {
                      setEditingCode(null);
                      setFormData({
                        code: '',
                        discountValue: '',
                        expiryDate: '',
                        usageLimit: '',
                        minimumOrderAmount: ''
                      });
                  }} className="text-gray-400 hover:text-white" disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!canSubmit || isSubmitting} className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
                    {isSubmitting ? 'Saving...' : editingCode ? 'Update Code' : 'Create Code'}
                  </Button>
                </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-dark-50 border border-white/5 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Active Promo Codes</h2>
              <span className="text-xs text-gray-500">
                {promoCodes.length} code{promoCodes.length !== 1 && 's'}
              </span>
            </div>

            {promoCodes.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No promo codes yet. Create your first code using the form above.
              </p>
            ) : (
              <div className="space-y-3">
                {promoCodes.map((promo) => {
                  const expired = isExpired(promo);
                  return (
                    <div
                      key={promo.id}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <Tag className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium tracking-wider">
                            {promo.code}
                          </p>
                          <p className="text-xs text-gray-500">
                            {promo.discountValue}% off 
                            • Expires {promo.expiryDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right text-xs text-gray-400">
                          <p>
                            Used {promo.usageCount} time
                            {promo.usageCount !== 1 && 's'}
                          </p>
                          <p>
                            Remaining:{' '}
                            <span className="text-white">{remainingUses(promo)}</span>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            updatePromoCode(promo.id, { isActive: !promo.isActive })
                          }
                          className={`w-10 h-5 rounded-full flex items-center px-1 transition ${promo.isActive && !expired
                              ? 'bg-green-500'
                              : 'bg-white/10'
                            }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${promo.isActive && !expired ? 'translate-x-5' : ''
                              }`}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if(confirm("Are you sure you want to delete this promo code?")) {
                               deletePromoCode(promo.id);
                            }
                          }}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {expired && (
                          <Badge className="bg-red-500/20 text-red-400 border-0 text-xs">
                            Expired
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}


