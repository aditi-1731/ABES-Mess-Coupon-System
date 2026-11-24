import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Clock, Volume2, VolumeX } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

// Synthesize pleasant Web Audio chimes (success and error)
function playBeep(type = 'success') {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (err) {
    // AudioContext blocked or unsupported
  }
}

export default function ScanResult({ result, onDismiss, autoReset = true }) {
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if (!result) return;

    if (soundEnabled) {
      if (result.status === 'VALID') playBeep('success');
      else playBeep('error');
    }

    // Vibration on mobile if supported
    if (navigator.vibrate) {
      if (result.status === 'VALID') navigator.vibrate([100, 50, 100]);
      else navigator.vibrate([300]);
    }

    if (autoReset) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 3500);
      return () => clearInterval(timer);
    }
  }, [result, soundEnabled, autoReset, onDismiss]);

  if (!result) return null;

  const statusConfigs = {
    VALID: {
      bgColor: 'bg-emerald-500 text-white',
      cardBorder: 'border-emerald-500 shadow-emerald-500/20',
      badge: 'success',
      icon: CheckCircle2,
      headline: 'VALID COUPON — SERVE MEAL'
    },
    ALREADY_USED: {
      bgColor: 'bg-red-500 text-white',
      cardBorder: 'border-red-500 shadow-red-500/20',
      badge: 'danger',
      icon: XCircle,
      headline: 'ALREADY REDEEMED TODAY'
    },
    EXPIRED: {
      bgColor: 'bg-amber-500 text-white',
      cardBorder: 'border-amber-500 shadow-amber-500/20',
      badge: 'warning',
      icon: AlertTriangle,
      headline: 'COUPON EXPIRED'
    },
    NOT_BOOKED: {
      bgColor: 'bg-slate-700 text-white',
      cardBorder: 'border-slate-700 shadow-slate-700/20',
      badge: 'default',
      icon: XCircle,
      headline: 'NO BOOKING FOUND'
    }
  };

  const config = statusConfigs[result.status] || statusConfigs.NOT_BOOKED;
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={onDismiss}
        className="cursor-pointer select-none"
      >
        <Card className={`overflow-hidden border-2 shadow-2xl ${config.cardBorder}`}>
          {/* Header Banner */}
          <div className={`${config.bgColor} p-5 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <Icon className="w-8 h-8 shrink-0 animate-bounce" />
              <div>
                <h3 className="font-heading font-black text-xl tracking-wide uppercase">
                  {config.headline}
                </h3>
                <p className="text-xs text-white/90">
                  {result.message}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled(!soundEnabled);
              }}
              className="p-2 rounded-xl bg-black/10 hover:bg-black/20 text-white transition-colors"
              title="Toggle Audio Beep"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>

          {/* Student & Meal Details */}
          <div className="p-6 bg-white dark:bg-dark-card space-y-4">
            {result.student && (
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-dark-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-navy text-white font-bold text-base flex items-center justify-center uppercase shadow-md">
                    {result.student.avatar || result.student.name?.substring(0, 2) || 'ST'}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-lg text-navy dark:text-white">
                      {result.student.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono">
                      Roll No: {result.student.rollNo} • {result.student.department || 'CSE'}
                    </p>
                  </div>
                </div>

                {result.remainingMeals !== undefined && (
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">Meals Left</span>
                    <span className="font-extrabold text-lg text-orange font-heading">
                      {result.remainingMeals}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Extra details for used or valid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              {result.booking && (
                <div>
                  <span className="text-slate-400 block">Meal Type & Slot</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {result.booking.mealType} ({result.booking.slot || 'Current'})
                  </span>
                </div>
              )}

              {result.usedAt && (
                <div>
                  <span className="text-slate-400 block">Redeemed At</span>
                  <span className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {result.usedAt}
                  </span>
                </div>
              )}

              {result.servedBy && (
                <div>
                  <span className="text-slate-400 block">Counter Location</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {result.servedBy}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-dark-border">
              <span>Auto-clearing in 3.5s...</span>
              <span className="text-orange font-medium">Tap anywhere to reset</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
