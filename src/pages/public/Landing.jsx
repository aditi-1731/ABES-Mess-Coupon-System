import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import CrowdMeter from '../../components/features/CrowdMeter';
import RatingStars from '../../components/features/RatingStars';
import { useAuth } from '../../context/AuthContext';
import { initialMenu } from '../../data/menu';
import { QRCodeSVG } from 'qrcode.react';
import {
  ArrowRight,
  QrCode,
  ShieldCheck,
  Clock,
  Sparkles,
  UtensilsCrossed,
  Users,
  ChevronDown,
  TrendingDown,
  Zap,
  CheckCircle2,
  CalendarCheck,
  Smartphone,
  Award
} from 'lucide-react';

export default function Landing() {
  const { quickLogin } = useAuth();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const [demoLoading, setDemoLoading] = useState(null);
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

  // Auto-rotating QR mock inside phone
  const [phoneQrSec, setPhoneQrSec] = useState(58);
  useEffect(() => {
    const timer = setInterval(() => {
      setPhoneQrSec(prev => (prev <= 1 ? 60 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDemoLogin = async (role) => {
    setDemoLoading(role);
    try {
      const user = await quickLogin(role);
      const routes = {
        student: '/student/dashboard',
        staff: '/staff/scanner',
        manager: '/manager/menu',
        admin: '/admin/dashboard'
      };
      navigate(routes[role] || '/student/dashboard');
    } catch (err) {
      console.error('Demo login failed:', err);
    } finally {
      setDemoLoading(null);
    }
  };

  const todayMeals = initialMenu.slice(0, 4);

  const features = [
    {
      icon: QrCode,
      title: 'Rotating Anti-Fraud QR',
      desc: 'Dynamic 60-second self-refreshing QR code renders screenshots completely useless for meal sharing.'
    },
    {
      icon: Clock,
      title: 'Time-Slot Allocations',
      desc: 'Pick your preferred dining slot to spread the crowd evenly across meal windows with zero waiting.'
    },
    {
      icon: TrendingDown,
      title: 'Food Wastage Reduction',
      desc: 'Students opt-out of meals before the cut-off, letting the kitchen prepare exact portions.'
    },
    {
      icon: Users,
      title: 'Live Mess Crowd Gauge',
      desc: 'Real-time dining hall capacity meter shows live wait times and the best time slot to visit.'
    },
    {
      icon: Zap,
      title: 'Sub-Second Counter Scan',
      desc: 'Dedicated counter scanner verifies bookings in milliseconds with sound cues and instant status.'
    },
    {
      icon: UtensilsCrossed,
      title: 'Nutritious Weekly Menus',
      desc: '7-day rotating menu planner with calories, dietary labels, and ratings curated by the mess committee.'
    },
    {
      icon: ShieldCheck,
      title: 'Role-Based Ecosystem',
      desc: 'Integrated portals for students, counter staff, mess manager, and institutional administrators.'
    },
    {
      icon: Smartphone,
      title: 'PWA Mobile First',
      desc: 'Feels and behaves like a native mobile app on any smartphone browser with zero downloads needed.'
    }
  ];

  const steps = [
    {
      num: '01',
      title: 'Choose Meal Plan',
      desc: 'Select from Monthly Standard, Weekly Flexi, or Pay-Per-Meal wallet tokens with instant mock UPI.'
    },
    {
      num: '02',
      title: 'Book Meal Slot',
      desc: 'Browse today’s 4 meals and reserve your preferred time slot with real-time capacity feedback.'
    },
    {
      num: '03',
      title: 'Show Dynamic QR',
      desc: 'Open your coupon with rotating 60s security token right on your phone at the mess counter.'
    },
    {
      num: '04',
      title: 'Scan & Enjoy',
      desc: 'Staff scans your QR in milliseconds. Pick up your hot, freshly served meal with zero queue.'
    }
  ];

  const faqs = [
    {
      q: 'How does the anti-fraud QR code stop screenshot sharing?',
      a: 'The coupon QR code encodes a dynamic cryptographic token that refreshes every 60 seconds with an animated countdown ring. If a student takes a screenshot and sends it to a friend, the token expires before the friend reaches the counter.'
    },
    {
      q: 'What if I am outside campus or want to skip a meal?',
      a: 'You can tap "Skip Meal" on your dashboard before the cut-off time (e.g. 11:00 AM for Lunch). This alerts the kitchen not to cook for you, directly reducing college food wastage!'
    },
    {
      q: 'Can this demo be tested without a webcam?',
      a: 'Yes! The Staff Scanner page includes a rich "Simulate Scan" panel where you can click any booked student to verify them instantly, or simulate expired and already-used tickets with one click.'
    },
    {
      q: 'How does cross-tab synchronization work?',
      a: 'When counter staff scans a coupon in one browser tab, an event syncs to the student’s open tab within seconds, instantly changing the coupon status to "Served" with a timestamp stamp.'
    }
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg text-slate-800 dark:text-slate-100 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-soft dark:bg-orange/20 text-orange border border-orange/30 text-xs font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Next-Gen Dining for ABES Engineering College</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-navy dark:text-white tracking-tight leading-[1.1]">
                Skip the queue. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-amber-500">
                  Scan. Eat.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0">
                Long hostel mess lines are now history. Book meal slots, get rotating 60-second anti-fraud QR coupons, and pick up fresh meals in seconds.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Student Login
                  </Button>
                </Link>
              </div>

              {/* Try Demo Quick Role Row */}
              {isDemoMode && (
                <div className="pt-6 border-t border-slate-200/80 dark:border-dark-border">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    🚀 One-Click Instant Demo Portals:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { role: 'student', label: 'Student', desc: 'Aditi (CSE)' },
                      { role: 'staff', label: 'Staff', desc: 'Counter 1' },
                      { role: 'manager', label: 'Manager', desc: 'Mrs. Sunita' },
                      { role: 'admin', label: 'Admin', desc: 'Prof. Sharma' }
                    ].map((item) => (
                      <button
                        key={item.role}
                        onClick={() => handleDemoLogin(item.role)}
                        disabled={demoLoading !== null}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card hover:border-orange hover:shadow-md transition-all text-left group"
                      >
                        <span className="text-xs font-bold text-navy dark:text-white group-hover:text-orange block">
                          {item.label} Demo
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {demoLoading === item.role ? 'Logging in...' : item.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Phone Mockup with Animated Dynamic QR */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 sm:w-80 rounded-[2.5rem] bg-navy-dark p-3.5 shadow-2xl ring-1 ring-white/20">
                {/* Phone Notch */}
                <div className="absolute top-6 inset-x-0 h-4 flex justify-center z-20">
                  <div className="w-24 h-4 bg-navy-dark rounded-b-xl" />
                </div>

                {/* Phone Screen */}
                <div className="rounded-[2rem] overflow-hidden bg-background dark:bg-dark-bg p-4 pt-8 text-center flex flex-col justify-between h-[520px] border border-slate-700/50">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-4 px-1">
                      <span>ABES Mess Pass</span>
                      <span className="text-success font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Live Active
                      </span>
                    </div>

                    <div className="p-4 bg-white rounded-2xl shadow-md border border-slate-100 flex flex-col items-center">
                      <QRCodeSVG
                        value={`ABES|DEMO|ADITI|${phoneQrSec}`}
                        size={170}
                        level="H"
                        includeMargin={false}
                      />
                      <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                        <ShieldCheck className="w-3.5 h-3.5 text-success" />
                        <span>Refreshes in {phoneQrSec}s</span>
                      </div>
                    </div>

                    <div className="mt-4 text-left px-1">
                      <h4 className="font-heading font-bold text-sm text-navy dark:text-white">
                        Aditi
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        24B0101070 • CSE
                      </p>
                      <div className="mt-2 flex items-center justify-between text-xs bg-orange-soft/40 dark:bg-orange/10 p-2 rounded-lg text-orange font-semibold">
                        <span>Lunch: Dal Makhani Thali</span>
                        <span>12:30 - 13:00</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-[10px] text-slate-400">
                      Scan at Counter 1 • Single Use Pass
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Strip */}
      <section className="bg-navy text-white py-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold font-heading text-orange">
                85,000+
              </p>
              <p className="text-xs text-slate-300 mt-1 uppercase tracking-wider">
                Meals Served Online
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
                14.5 min
              </p>
              <p className="text-xs text-slate-300 mt-1 uppercase tracking-wider">
                Average Queue Saved
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold font-heading text-emerald-400">
                32%
              </p>
              <p className="text-xs text-slate-300 mt-1 uppercase tracking-wider">
                Food Waste Cut
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold font-heading text-amber-400">
                1,400+
              </p>
              <p className="text-xs text-slate-300 mt-1 uppercase tracking-wider">
                Active Hostellers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (4-Step Timeline) */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="primary" size="md">Simple 4-Step Process</Badge>
          <h2 className="text-3xl font-extrabold font-heading text-navy dark:text-white mt-3">
            How The Coupon System Works
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Designed for frictionless meal pickups without physical tokens or long queues.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((st) => (
            <Card key={st.num} hoverLift className="p-6 relative">
              <span className="text-3xl font-extrabold font-heading text-orange/30 block mb-3">
                {st.num}
              </span>
              <h3 className="text-base font-bold font-heading text-navy dark:text-white mb-2">
                {st.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {st.desc}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Live Crowd Demo & Today's Menu Preview */}
      <section id="menu-preview" className="py-16 bg-slate-50 dark:bg-dark-bg/60 border-y border-slate-200/80 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Live Crowd Widget */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <Badge variant="navy" size="md">Real-Time Sensor</Badge>
                <h3 className="text-2xl font-bold font-heading text-navy dark:text-white mt-2">
                  Live Mess Counter Occupancy
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Check waiting times before stepping out of your hostel room.
                </p>
              </div>

              <CrowdMeter />

              <div className="p-4 rounded-2xl bg-orange-soft/40 dark:bg-orange/10 border border-orange/20 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-orange shrink-0 mt-0.5" />
                <p>
                  <strong>Smart Dining Tip:</strong> Booking slots between 1:30 PM - 2:00 PM reduces queue waiting time by up to 70%!
                </p>
              </div>
            </div>

            {/* Right: Today's Menu Sample */}
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold font-heading text-navy dark:text-white">
                    Today's Thali Preview
                  </h3>
                  <p className="text-xs text-slate-500">
                    Freshly prepared Indian recipes with balanced calories
                  </p>
                </div>
                <Link to="/login">
                  <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                    Full Weekly Menu
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {todayMeals.map((m) => (
                  <Card key={m.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-orange uppercase tracking-wider">
                        {m.mealType}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {m.timing}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {m.name}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {m.items.join(', ')}
                    </p>
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-dark-border text-xs">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">{m.calories} kcal</span>
                      <div className="flex items-center gap-1">
                        <RatingStars rating={m.rating} size="sm" />
                        <span className="font-bold">{m.rating}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid (8 Cards) */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="primary" size="md">Engineered for Reliability</Badge>
          <h2 className="text-3xl font-extrabold font-heading text-navy dark:text-white mt-3">
            Everything ABES Mess Needs
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            From anti-fraud scanning to portion forecasting and food waste analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <Card key={idx} hoverLift className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-soft/80 dark:bg-orange/20 text-orange flex items-center justify-center mb-4">
                <feat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-heading text-navy dark:text-white mb-2">
                {feat.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-16 bg-slate-50 dark:bg-dark-bg/60 border-t border-slate-200/80 dark:border-dark-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge variant="navy" size="md">Common Queries</Badge>
            <h2 className="text-3xl font-extrabold font-heading text-navy dark:text-white mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between font-heading font-semibold text-sm text-navy dark:text-white"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180 text-orange' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-dark-border pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action Banner */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl bg-gradient-to-tr from-navy to-navy-light text-white p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading mb-4">
            Ready to Skip the Mess Queue?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Join 1,400+ ABES engineering students who book their meals online every day. Zero waiting, zero food waste.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto">
                Create Student Account
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-white/30 hover:bg-white/10">
                Log In to Existing Pass
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
