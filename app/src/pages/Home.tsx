import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/sections/Hero';
import Categories from '@/sections/Categories';
import TrendingEvents from '@/sections/TrendingEvents';
import Features from '@/sections/Features';
import CTA from '@/sections/CTA';

export default function Home() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password, 'admin');
      setShowAdminLogin(false);
      navigate('/admin');
    } catch (err: unknown) {
      alert((err as Error).message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg relative">
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <TrendingEvents />
        <Features />
        <CTA />
      </main>
      <Footer />

      {/* Admin Login Trigger - Bottom Right */}
      {!user && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdminLogin(true)}
            className="text-white/20 hover:text-white/50 hover:bg-white/5 text-xs"
          >
            Admin Portal
          </Button>
        </div>
      )}

      {/* Admin Login Dialog */}
      <Dialog open={showAdminLogin} onOpenChange={setShowAdminLogin}>
        <DialogContent className="bg-dark-bg border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Access</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdminLogin} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@ticikitify.com"
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setShowAdminLogin(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                Login
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
