import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useAuth } from '../../context/AuthContext';
import * as mockApi from '../../services/mockApi';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ScanResult from '../../components/features/ScanResult';
import { getTodayDateString, formatDate } from '../../utils/formatDate';
import {
  Camera,
  CameraOff,
  ScanLine,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  AlertTriangle,
  History,
  Search,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function StaffScanner() {
  const { user } = useAuth();
  const [cameraActive, setCameraActive] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [manualToken, setManualToken] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Counter metrics
  const [stats, setStats] = useState({
    servedCount: 42,
    remainingCount: 18,
    currentMeal: 'Lunch',
    counterName: user?.counter || 'Counter 1 - Main Hall'
  });

  // Recent scans list
  const [recentScans, setRecentScans] = useState([]);
  const [todayBookings, setTodayBookings] = useState([]);

  const qrReaderRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  const today = getTodayDateString();

  const loadData = async () => {
    try {
      const bookings = await mockApi.getBookings(null, today);
      setTodayBookings(bookings);

      const historyData = await mockApi.getHistory();
      const servedToday = historyData.filter(h => h.date === today && h.status === 'Served');
      setRecentScans(servedToday.slice(0, 10));

      const activeCount = bookings.filter(b => b.status === 'Active' || b.status === 'Booked').length;
      setStats(prev => ({
        ...prev,
        servedCount: servedToday.length,
        remainingCount: activeCount
      }));
    } catch (err) {
      console.error('Error loading staff scanner data:', err);
    }
  };

  useEffect(() => {
    loadData();

    // Listen for storage events across tabs
    const handleStorage = () => loadData();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // HTML5-QRCode camera scanner lifecycle
  const startCamera = async () => {
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('camera-reader-box');
      }

      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          handleVerify(decodedText);
        },
        (errorMessage) => {
          // ignore transient frame decode errors
        }
      );
      setCameraActive(true);
      toast.success('Camera scanner active');
    } catch (err) {
      console.warn('Camera permission denied or camera unavailable:', err);
      toast.error('Camera access denied or unavailable. Use simulation panel below.');
      setCameraActive(false);
    }
  };

  const stopCamera = async () => {
    try {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      }
    } catch (err) {
      console.error('Failed to stop camera scanner:', err);
    } finally {
      setCameraActive(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Verification logic
  const handleVerify = async (tokenOrId) => {
    if (isVerifying || !tokenOrId) return;
    setIsVerifying(true);

    try {
      const result = await mockApi.verifyCoupon(tokenOrId, stats.counterName);
      setScanResult(result);
      await loadData();
    } catch (err) {
      setScanResult({
        status: 'NOT_BOOKED',
        message: err.message || 'Verification error'
      });
    } finally {
      setIsVerifying(false);
      setManualToken('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Meal and Counter Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-soft">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange text-white flex items-center justify-center font-bold shadow-md shadow-orange/20">
            <ScanLine className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-heading text-navy dark:text-white">
                Counter Scanner Console
              </h2>
              <Badge variant="success" size="sm" dot>Active Service</Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Location: <strong>{stats.counterName}</strong> • Current Service: <strong>{stats.currentMeal}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div>
            <span className="text-slate-400 block uppercase font-bold text-[10px]">Served Today</span>
            <span className="text-2xl font-black font-heading text-emerald-600 dark:text-emerald-400">
              {stats.servedCount}
            </span>
          </div>
          <div className="border-l border-slate-200 dark:border-dark-border pl-6">
            <span className="text-slate-400 block uppercase font-bold text-[10px]">Booked Waiting</span>
            <span className="text-2xl font-black font-heading text-orange">
              {stats.remainingCount}
            </span>
          </div>
        </div>
      </div>

      {/* Verification Result Card if active */}
      {scanResult && (
        <ScanResult
          result={scanResult}
          onDismiss={() => setScanResult(null)}
          autoReset={true}
        />
      )}

      {/* Main Scanner Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Camera Scanner Box */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="p-6 text-center flex flex-col items-center justify-center min-h-[380px]">
            <div
              id="camera-reader-box"
              className={`w-full max-w-sm rounded-2xl overflow-hidden bg-slate-900 border-2 border-dashed border-slate-700 aspect-square flex flex-col items-center justify-center text-white ${
                !cameraActive ? 'p-8' : ''
              }`}
            >
              {!cameraActive && (
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-orange">
                    <Camera className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold font-heading">
                    Camera Scanner Standby
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Activate device webcam to scan student QR tickets in real-time.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 flex gap-3">
              {!cameraActive ? (
                <Button
                  variant="primary"
                  size="md"
                  icon={Camera}
                  onClick={startCamera}
                >
                  Start Camera Scanner
                </Button>
              ) : (
                <Button
                  variant="danger"
                  size="md"
                  icon={CameraOff}
                  onClick={stopCamera}
                >
                  Stop Camera
                </Button>
              )}
            </div>
          </Card>

          {/* Manual Token Verification Box */}
          <Card className="p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Manual Token / Roll No Lookup
            </h4>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerify(manualToken);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                placeholder="Paste ABES|... token or enter Roll No"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-orange/30"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={isVerifying}
                disabled={!manualToken.trim()}
              >
                Verify
              </Button>
            </form>
          </Card>
        </div>

        {/* Right: Simulation Panel (Essential for testing without camera) */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold font-heading text-navy dark:text-white">
                    Simulate Counter Scans
                  </h3>
                  <Badge variant="primary" size="sm">No-Camera Mode</Badge>
                </div>
                <p className="text-xs text-slate-500">
                  Click any student below to simulate their QR pass arriving at the counter:
                </p>
              </div>

              <button
                onClick={loadData}
                title="Refresh queue list"
                className="p-1.5 rounded-lg text-slate-400 hover:text-orange hover:bg-slate-100 dark:hover:bg-dark-border"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Simulation Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVerify('SIMULATE_ALREADY_USED')}
                className="text-xs border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                ⚠️ Scan Already-Used QR
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVerify('SIMULATE_EXPIRED')}
                className="text-xs border-amber-300 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
              >
                ⏱️ Scan Expired QR
              </Button>
            </div>

            {/* Today's Booked Students List */}
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Today's Bookings Queue ({todayBookings.length}):
              </p>

              {todayBookings.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No active bookings for today.
                </div>
              ) : (
                todayBookings.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => handleVerify(b.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      b.status === 'Used'
                        ? 'bg-slate-50 dark:bg-dark-bg/60 border-slate-200/60 opacity-60'
                        : 'bg-white dark:bg-dark-card border-slate-200 dark:border-dark-border hover:border-orange hover:shadow-md'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-navy dark:text-white">
                          {b.studentName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {b.rollNo}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {b.mealType} • Slot: <strong>{b.slot}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant={b.status === 'Used' ? 'default' : b.status === 'Skipped' ? 'warning' : 'success'}
                        size="sm"
                        dot
                      >
                        {b.status}
                      </Badge>
                      <span className="text-[11px] font-bold text-orange hover:underline">
                        Tap to Scan →
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Recent Scans Strip */}
          <Card className="p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Last 10 Counter Redemptions
            </h4>

            {recentScans.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No meals redeemed yet today.</p>
            ) : (
              <div className="space-y-2">
                {recentScans.slice(0, 5).map((scan) => (
                  <div key={scan.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 dark:border-dark-border last:border-0">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{scan.studentName}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">{scan.mealType} • {scan.counter}</span>
                    </div>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {formatDate(scan.servedAt, 'time')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
