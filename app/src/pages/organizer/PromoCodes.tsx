import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, Calendar, Percent, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { useOrganizer } from '@/context/OrganizerContext';
import type { PromoCode } from '@/types';

export default function OrganizerPromoCodes() {
  const { promoCodes, addPromoCode, updatePromoCode } = useOrganizer();
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<PromoCode['discountType']>('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const [expiryDate, setExpiryDate] = useState('');
  const [usageLimit, setUsageLimit] = useState<number | undefined>(undefined);
  const [minimumOrderAmount, setMinimumOrderAmount] = useState<number | undefined>(undefined);

  const handleCreate = () => {
    if (!code || !discountValue || !expiryDate) return;
    addPromoCode({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      expiryDate,
      usageLimit,
      minimumOrderAmount,
      isActive: true,
    });
    setCode('');
    setDiscountValue(0);
    setExpiryDate('');
    setUsageLimit(undefined);
    setMinimumOrderAmount(undefined);
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
      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Promo Codes</h1>
            <p className="text-gray-400 text-sm">
              Create discount codes with usage limits, expiry, and minimum order amounts.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="TICIKIFY50"
                    className="pl-9 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div>
                <Label className="text-gray-400">Discount Type</Label>
                <div className="flex gap-2 mt-1">
                  {(['percentage', 'fixed'] as PromoCode['discountType'][]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setDiscountType(type)}
                      className={`flex-1 px-3 py-2 rounded-xl border text-sm ${
                        discountType === type
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      {type === 'percentage' ? 'Percentage (%)' : 'Fixed Amount'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-gray-400">Discount Value</Label>
                <div className="relative mt-1">
                  <Percent className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="number"
                    value={discountValue || ''}
                    onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                    placeholder={discountType === 'percentage' ? '10' : '100'}
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
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="pl-9 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div>
                <Label className="text-gray-400">Usage Limit (optional)</Label>
                <Input
                  type="number"
                  value={usageLimit ?? ''}
                  onChange={(e) =>
                    setUsageLimit(e.target.value ? parseInt(e.target.value, 10) || 0 : undefined)
                  }
                  placeholder="e.g., 100"
                  className="mt-1 bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-400">Minimum Order Amount (optional)</Label>
                <Input
                  type="number"
                  value={minimumOrderAmount ?? ''}
                  onChange={(e) =>
                    setMinimumOrderAmount(
                      e.target.value ? parseInt(e.target.value, 10) || 0 : undefined,
                    )
                  }
                  placeholder="e.g., 1000"
                  className="mt-1 bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleCreate}
                disabled={!code || !discountValue || !expiryDate}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
              >
                Save Promo Code
              </Button>
            </div>
          </motion.div>

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
                            {promo.discountType === 'percentage'
                              ? `${promo.discountValue}% off`
                              : `৳${promo.discountValue} off`}{' '}
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
                          className={`w-10 h-5 rounded-full flex items-center px-1 transition ${
                            promo.isActive && !expired
                              ? 'bg-green-500'
                              : 'bg-white/10'
                          }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                              promo.isActive && !expired ? 'translate-x-5' : ''
                            }`}
                          />
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
  );
}


