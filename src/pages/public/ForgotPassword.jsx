import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ArrowLeft, MailCheck, Send } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-dark-bg p-4">
      <div className="max-w-md w-full bg-white dark:bg-dark-card p-8 rounded-3xl border border-slate-200 dark:border-dark-border shadow-xl">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange flex items-center justify-center text-white shadow-md">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="font-heading font-extrabold text-xl text-navy dark:text-white">
              ABES <span className="text-orange">MESS</span>
            </span>
          </Link>

          {!submitted ? (
            <>
              <h2 className="text-2xl font-bold font-heading text-navy dark:text-white">
                Reset Password
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your registered college email to receive a password reset link.
              </p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-sm">
                <MailCheck className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold font-heading text-navy dark:text-white">
                Reset Link Sent!
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                We've sent instructions to <strong>{email}</strong>. Please check your college inbox or spam folder.
              </p>
            </>
          )}
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Official Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. aarav@abes.ac.in"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon={Send}
              iconPosition="right"
              className="w-full justify-center"
            >
              Send Reset Link
            </Button>
          </form>
        ) : (
          <div className="space-y-3 pt-2">
            <Button
              variant="outline"
              size="md"
              className="w-full"
              onClick={() => setSubmitted(false)}
            >
              Try another email
            </Button>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-dark-border text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-orange"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
