import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { apiResendVerification } from '@/lib/api';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmail } = useAuth();

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'no-token'>('loading');
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('no-token');
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    const doVerify = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
        setMessage('Your email has been verified! You are now logged in.');
      } catch (err: unknown) {
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Verification failed. The link may have expired.');
      }
    };

    doVerify();
  }, [token, verifyEmail]);

  const handleResend = async () => {
    if (!resendEmail) return;
    setResendLoading(true);
    setResendMsg('');
    try {
      await apiResendVerification(resendEmail);
      setResendMsg('Verification email resent! Check your inbox.');
    } catch (err: unknown) {
      setResendMsg(err instanceof Error ? err.message : 'Failed to resend. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        {/* Loading */}
        {status === 'loading' && (
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-purple-500/20 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-white">Verifying your email...</h1>
            <p className="text-gray-400">Please wait a moment.</p>
          </div>
        )}

        {/* Success */}
        {status === 'success' && (
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Email Verified! 🎉</h1>
            <p className="text-gray-400">{message}</p>
            <Link to="/">
              <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-3">
                Go to Home
              </Button>
            </Link>
          </div>
        )}

        {/* Error / Expired */}
        {status === 'error' && (
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Link Expired</h1>
            <p className="text-gray-400">{message}</p>

            {/* Resend form */}
            <div className="bg-dark-50 border border-white/10 rounded-2xl p-6 text-left space-y-4">
              <p className="text-white font-medium text-sm">Request a new verification link:</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={resendEmail}
                  onChange={e => setResendEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-purple-500"
                />
                <Button
                  onClick={handleResend}
                  disabled={resendLoading || !resendEmail}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-sm"
                >
                  {resendLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Resend'}
                </Button>
              </div>
              {resendMsg && (
                <p className={`text-sm ${resendMsg.includes('resent') ? 'text-green-400' : 'text-red-400'}`}>
                  {resendMsg}
                </p>
              )}
            </div>

            <Link to="/login">
              <Button variant="outline" className="border-white/10 text-gray-400">
                Back to Login
              </Button>
            </Link>
          </div>
        )}

        {/* No token */}
        {status === 'no-token' && (
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Mail className="w-12 h-12 text-yellow-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Check Your Email</h1>
            <p className="text-gray-400">
              We've sent a verification link to your email. Click the link in the email to activate your account.
            </p>
            <Link to="/login">
              <Button variant="outline" className="border-white/10 text-gray-400">Back to Login</Button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
