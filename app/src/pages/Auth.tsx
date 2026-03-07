import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Eye, EyeOff, Mail, Lock, User, Phone,
  Chrome, Facebook, ArrowRight, ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Checkbox } from '@/components/ui/checkbox';

import { useAuth } from '@/context/AuthContext';

export default function Auth() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'customer' | 'organizer'>(() =>
    searchParams.get('type') === 'organizer' ? 'organizer' : 'customer'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+880');
  const [showVerifyScreen, setShowVerifyScreen] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        // ── LOGIN ──────────────────────────────────────────────
        await login(email, password, userType);
        // login() in AuthContext already fetches /me and sets user.
        // We call getToken + apiGetMe to know the role for redirect.
        const { getToken, apiGetMe } = await import('@/lib/api');
        if (getToken()) {
          const me = await apiGetMe();
          if (me.role === 'admin') navigate('/admin');
          else if (me.role === 'organizer') navigate('/organizer');
          else navigate('/');
        }
      } else {
        // ── REGISTER ───────────────────────────────────────────
        const result = await register({ name, email, password, phone, role: userType });
        if (result.requiresVerification) {
          setVerifyEmail(result.email);
          setShowVerifyScreen(true);
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Show email sent screen after registration
  if (showVerifyScreen) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-purple-500/20 flex items-center justify-center">
            <span className="text-5xl">📧</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Check Your Email!</h1>
          <p className="text-gray-400">
            We've sent a verification link to{' '}
            <span className="text-cyan-400 font-medium">{verifyEmail}</span>.
            Click the link in the email to activate your account.
          </p>
          <div className="bg-dark-50 border border-white/10 rounded-2xl p-5 text-left">
            <p className="text-gray-500 text-sm">📌 Didn't receive it? Check your spam folder, or</p>
            <button
              onClick={() => setShowVerifyScreen(false)}
              className="text-cyan-400 text-sm hover:underline mt-1"
            >
              go back and try again
            </button>
          </div>
          <Link to="/login">
            <Button variant="outline" className="border-white/10 text-gray-400 w-full">
              Back to Login
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/auth-illustration.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-dark-bg/50" />

        <div className="relative z-10 flex flex-col justify-end p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Experience the Best Events in Bangladesh
            </h2>
            <p className="text-gray-400 text-lg">
              Join millions of event lovers and discover unforgettable experiences.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-8 mt-8"
          >
            {[
              { value: '10K+', label: 'Events' },
              { value: '500K+', label: 'Users' },
              { value: '50+', label: 'Cities' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-gradient">{stat.value}</p>
                <p className="text-gray-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Back Button */}
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white mb-6 p-0 hover:bg-transparent">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Button>
          </Link>

          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/">
              <h1 className="text-3xl font-bold text-gradient mb-2">TICIKIFY</h1>
            </Link>
            <p className="text-gray-400">
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </p>
          </div>

          {/* User Type Toggle */}
          <div className="flex gap-2 p-1 rounded-xl bg-white/5 mb-6">
            <button
              onClick={() => setUserType('customer')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${userType === 'customer'
                ? 'bg-purple-500 text-white'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              I'm a User
            </button>
            <button
              onClick={() => setUserType('organizer')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${userType === 'organizer'
                ? 'bg-cyan-500 text-white'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              I'm an Organizer
            </button>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
              variant="outline"
              className="border-white/10 hover:bg-white/5"
            >
              <Chrome className="w-4 h-4 mr-2" />
              Google
            </Button>
            <Button
              variant="outline"
              className="border-white/10 hover:bg-white/5"
            >
              <Facebook className="w-4 h-4 mr-2" />
              Facebook
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark-bg text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label className="text-gray-400">Full Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="pl-10 bg-white/5 border-white/10 text-white"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <Label className="text-gray-400">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="pl-10 bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <Label className="text-gray-400">Phone Number</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1XXX-XXXXXX"
                    className="pl-10 bg-white/5 border-white/10 text-white"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <Label className="text-gray-400">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm text-gray-400">
                  I agree to the{' '}
                  <Link to="/terms" className="text-cyan-400 hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-cyan-400 hover:underline">Privacy Policy</Link>
                </Label>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm text-gray-400">
                    Remember me
                  </Label>
                </div>
                <Link to="/forgot-password" className="text-sm text-cyan-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-sm">{errorMsg}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || (!isLogin && !agreeTerms)}
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-6"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Toggle Login/Register */}
          <p className="text-center text-gray-400 mt-6">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-cyan-400 hover:underline font-medium"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>

        </motion.div>
      </div>
    </div>
  );
}
