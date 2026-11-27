import React from 'react';
import { UtensilsCrossed, ShieldCheck, Heart } from 'lucide-react';
import { COLLEGE_NAME } from '../../utils/constants';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-orange flex items-center justify-center text-white">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="font-heading font-extrabold text-lg text-navy dark:text-white">
                ABES <span className="text-orange">MESS</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-4">
              Smart dining coupon management and anti-fraud verification system. Developed for {COLLEGE_NAME} to eliminate meal queues and minimize food wastage.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>ABES FSD Capstone Demo Edition (Frontend-Only Prototype)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#features" className="hover:text-orange">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-orange">How It Works</a></li>
              <li><a href="#menu-preview" className="hover:text-orange">Today's Menu</a></li>
              <li><a href="#faq" className="hover:text-orange">Frequently Asked Questions</a></li>
            </ul>
          </div>

          {/* Roles Demo */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              User Portals
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><span className="text-slate-700 dark:text-slate-300 font-medium">Student:</span> Booking & Dynamic QR</li>
              <li><span className="text-slate-700 dark:text-slate-300 font-medium">Staff:</span> Instant Counter Scanner</li>
              <li><span className="text-slate-700 dark:text-slate-300 font-medium">Manager:</span> Menu & Portion Analytics</li>
              <li><span className="text-slate-700 dark:text-slate-300 font-medium">Admin:</span> User Access & System Controls</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-dark-border pt-6 flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
          <p>
            Developed and maintained by: <span className="font-medium text-slate-700 dark:text-slate-200">Aditi Tripathi</span>, <span className="font-medium text-slate-700 dark:text-slate-200">Aayushi Rawat</span> | Computer Science and Engineering, CSE11
          </p>
          <p>Full Stack Development Team</p>
          <p>© ABESEC Ghaziabad. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
