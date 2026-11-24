import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ArrowLeft, Home } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-dark-bg p-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-orange-soft text-orange flex items-center justify-center mx-auto shadow-md">
          <UtensilsCrossed className="w-10 h-10" />
        </div>

        <h1 className="text-6xl font-black font-heading text-navy dark:text-white">
          404
        </h1>

        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-800 dark:text-slate-100">
            Page Not Found
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            The page or coupon URL you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link to="/">
            <Button variant="primary" size="md" icon={Home}>
              Return Home
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="md">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
