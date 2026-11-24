import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw,
  Maximize2,
  Download,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Utensils,
  Share2,
  X
} from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { generateCouponToken } from '../../utils/generateToken';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';

export default function QRCoupon({ booking, student, onRefreshStatus }) {
  const [token, setToken] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const qrCanvasRef = useRef(null);

  const isUsed = booking?.status === 'Used';
  const isExpired = booking?.status === 'Expired';
  const isActive = booking?.status === 'Active' || booking?.status === 'Booked';

  // Generate / refresh token every 60 seconds
  const generateNewToken = () => {
    if (!booking || !student || isUsed || isExpired) return;
    setIsRefreshing(true);
    const newToken = generateCouponToken(booking.id, student.id, booking.menuId || booking.mealType);
    setToken(newToken);
    setTimeLeft(60);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  useEffect(() => {
    if (booking && student && !isUsed && !isExpired) {
      generateNewToken();
    }
  }, [booking?.id, booking?.status, student?.id]);

  useEffect(() => {
    if (isUsed || isExpired) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          generateNewToken();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [booking?.id, booking?.status, student?.id, isUsed, isExpired]);

  // Download ticket as PNG
  const handleDownloadTicket = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 700;
      const ctx = canvas.getContext('2d');

      // Card background
      ctx.fillStyle = '#0F1B33';
      ctx.roundRect(0, 0, 500, 700, 24);
      ctx.fill();

      // Header
      ctx.fillStyle = '#FF7A1A';
      ctx.font = 'bold 24px Poppins, sans-serif';
      ctx.fillText('ABES MESS COUPON', 40, 55);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText('Official Dining Entry Ticket', 40, 80);

      // White Body Panel
      ctx.fillStyle = '#FFFFFF';
      ctx.roundRect(30, 110, 440, 550, 18);
      ctx.fill();

      // Student Info
      ctx.fillStyle = '#0F1B33';
      ctx.font = 'bold 22px Poppins, sans-serif';
      ctx.fillText(student?.name || 'Student', 50, 155);

      ctx.fillStyle = '#64748B';
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText(`Roll: ${student?.rollNo || 'N/A'} • ${booking?.mealType || 'Meal'}`, 50, 185);
      ctx.fillText(`Time Slot: ${booking?.slot || 'Standard'}`, 50, 210);
      ctx.fillText(`Date: ${formatDate(booking?.date)}`, 50, 235);

      // Draw QR from existing SVG/Canvas if present
      const qrEl = document.getElementById(`qr-canvas-${booking?.id}`);
      if (qrEl) {
        ctx.drawImage(qrEl, 125, 270, 250, 250);
      }

      ctx.fillStyle = '#94A3B8';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText('Valid for single redemption at ABES Mess Counter', 70, 570);
      ctx.fillText(`Generated Token: ${token.substring(0, 28)}...`, 60, 600);

      // Download trigger
      const link = document.createElement('a');
      link.download = `ABES-Coupon-${booking?.mealType}-${student?.rollNo || 'ticket'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Ticket downloaded successfully!');
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Could not download image.');
    }
  };

  // Circular timer progress calculation (circumference: 2 * pi * 14 = 87.96)
  const strokeDashoffset = 88 - (88 * timeLeft) / 60;

  return (
    <>
      <div className="relative max-w-md mx-auto">
        {/* Ticket Outer Wrapper */}
        <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-dark-card border border-slate-200/90 dark:border-dark-border shadow-xl">
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-navy to-navy-light p-6 text-white relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange flex items-center justify-center text-white shadow-md">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base tracking-tight text-white">
                    ABES MESS PASS
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Hostel Dining Board
                  </p>
                </div>
              </div>

              <Badge
                variant={isUsed ? 'default' : isExpired ? 'danger' : 'success'}
                dot
                size="md"
              >
                {booking?.status || 'Active'}
              </Badge>
            </div>

            {/* Meal & Student details */}
            <div className="mt-5 pt-4 border-t border-white/10 flex items-start justify-between">
              <div>
                <p className="text-xl font-bold font-heading text-white">
                  {booking?.mealType}
                </p>
                <p className="text-xs text-orange font-medium mt-0.5">
                  {booking?.menuName || 'Special Mess Meal'}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs font-semibold text-slate-200">
                  {student?.name}
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  {student?.rollNo}
                </p>
              </div>
            </div>
          </div>

          {/* Ticket Perforation Notch (sawtooth/ticket effect) */}
          <div className="relative flex items-center justify-between px-3 -my-3 z-10">
            <div className="w-6 h-6 rounded-full bg-background dark:bg-dark-bg -ml-6 shadow-inner border-r border-slate-200 dark:border-dark-border" />
            <div className="flex-1 border-t-2 border-dashed border-slate-200 dark:border-dark-border mx-2" />
            <div className="w-6 h-6 rounded-full bg-background dark:bg-dark-bg -mr-6 shadow-inner border-l border-slate-200 dark:border-dark-border" />
          </div>

          {/* QR Code Presentation Box */}
          <div className="p-6 pt-8 flex flex-col items-center">
            {/* White QR Background Pad (maximum scanner contrast) */}
            <div className="relative p-5 bg-white rounded-2xl shadow-inner border border-slate-100 flex flex-col items-center justify-center">
              {/* Dynamic QR */}
              <div
                className={`relative transition-all duration-300 ${
                  isRefreshing ? 'opacity-40 scale-95' : 'opacity-100 scale-100'
                } ${isUsed ? 'filter blur-sm opacity-30 grayscale' : ''}`}
              >
                <QRCodeCanvas
                  id={`qr-canvas-${booking?.id}`}
                  value={token || `ABES|${booking?.id}|SAMPLE`}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>

              {/* Stamp Overlay if Used */}
              {isUsed && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="px-4 py-2 border-4 border-slate-600 dark:border-slate-400 rounded-xl rotate-[-12deg] bg-white/90 shadow-lg text-center">
                    <span className="block font-heading font-black text-2xl tracking-widest text-slate-800 uppercase">
                      SERVED
                    </span>
                    <span className="block text-[11px] font-bold text-slate-600">
                      {booking?.servedAt ? formatDate(booking.servedAt, 'time') : 'Redeemed'}
                    </span>
                  </div>
                </div>
              )}

              {/* Expired Stamp */}
              {isExpired && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="px-4 py-2 border-4 border-danger rounded-xl rotate-[12deg] bg-white/90 shadow-lg text-center">
                    <span className="block font-heading font-black text-2xl tracking-widest text-danger uppercase">
                      EXPIRED
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Circular Countdown Ring (Anti-Fraud) */}
            {isActive && (
              <div className="mt-4 flex items-center gap-3">
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <svg className="w-8 h-8 transform -rotate-90">
                    <circle
                      cx="16"
                      cy="16"
                      r="13"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-slate-100 dark:text-dark-border"
                      fill="transparent"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="13"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeDasharray="81.68"
                      strokeDashoffset={81.68 - (81.68 * timeLeft) / 60}
                      strokeLinecap="round"
                      className="text-orange transition-all duration-1000"
                      fill="transparent"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    {timeLeft}s
                  </span>
                </div>

                <div className="text-left">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-success" />
                    <span>Dynamic Rotating QR</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Screenshot protected • Auto-refreshes in {timeLeft}s
                  </p>
                </div>

                <button
                  onClick={generateNewToken}
                  disabled={isRefreshing}
                  title="Refresh QR token manually"
                  className="p-1.5 text-slate-400 hover:text-orange hover:bg-slate-100 dark:hover:bg-dark-border rounded-lg transition-colors ml-auto"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-orange' : ''}`} />
                </button>
              </div>
            )}

            {/* Booking Slot & Date Metadata */}
            <div className="w-full mt-5 pt-4 border-t border-slate-100 dark:border-dark-border space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange" />
                  Allocated Time Slot:
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {booking?.slot || '12:30 - 13:00'}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange" />
                  Date of Dining:
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formatDate(booking?.date)}
                </span>
              </div>
            </div>

            {/* Actions: Fullscreen & Download */}
            <div className="w-full grid grid-cols-2 gap-3 mt-6">
              <Button
                variant="outline"
                size="sm"
                icon={Maximize2}
                onClick={() => setFullscreenOpen(true)}
              >
                Fullscreen
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Download}
                onClick={handleDownloadTicket}
              >
                Save Ticket
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen QR Modal */}
      <Modal
        isOpen={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
        title="Show to Counter Staff"
        subtitle="Place your screen in front of the scanner"
        maxWidth="max-w-md"
      >
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl">
          <div className="p-4 bg-white rounded-xl shadow-inner border border-slate-100">
            <QRCodeSVG
              value={token || `ABES|${booking?.id}`}
              size={260}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="text-center mt-5">
            <p className="text-lg font-bold font-heading text-navy">
              {student?.name}
            </p>
            <p className="text-xs font-semibold text-slate-500 font-mono">
              Roll No: {student?.rollNo}
            </p>
            <p className="text-sm font-bold text-orange mt-1">
              {booking?.mealType} • {booking?.slot}
            </p>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
              <span className="w-2 h-2 rounded-full bg-success animate-ping" />
              <span>Token refreshed • Valid now</span>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
