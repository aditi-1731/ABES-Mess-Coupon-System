import React, { useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Stepper from '../ui/Stepper';
import { Check, CreditCard, Wallet, Smartphone, ShieldCheck, Download } from 'lucide-react';
import { formatCurrency } from '../../utils/formatDate';
import { fireConfetti } from './Confetti';
import toast from 'react-hot-toast';

export default function PlanCard({
  plan,
  isCurrent = false,
  mealsLeft = 0,
  onBuy
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(0); // 0: select payment, 1: processing, 2: receipt
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [receiptData, setReceiptData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartPurchase = () => {
    setStep(0);
    setReceiptData(null);
    setModalOpen(true);
  };

  const handleExecutePayment = async () => {
    setIsProcessing(true);
    setStep(1);

    // Simulate payment gateway delay (1.2s)
    setTimeout(async () => {
      try {
        const res = await onBuy(plan.id, { method: paymentMethod });
        setReceiptData(res);
        setStep(2);
        fireConfetti();
      } catch (err) {
        toast.error('Payment failed');
        setModalOpen(false);
      } finally {
        setIsProcessing(false);
      }
    }, 1200);
  };

  return (
    <>
      <Card
        hoverLift
        className={`relative overflow-hidden flex flex-col justify-between p-6 ${
          plan.isPopular
            ? 'border-2 border-orange shadow-soft-lg dark:border-orange'
            : isCurrent
            ? 'border-2 border-emerald-500'
            : ''
        }`}
      >
        {/* Most Popular Ribbon */}
        {plan.isPopular && (
          <div className="absolute top-0 right-0 bg-gradient-to-l from-orange to-amber-500 text-white font-heading text-[10px] font-bold uppercase tracking-wider py-1 px-4 rounded-bl-xl shadow-sm">
            Most Popular
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-heading font-bold text-xl text-navy dark:text-white">
              {plan.name}
            </h3>
            {isCurrent && (
              <Badge variant="success" size="sm" dot>Current Plan</Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
            {plan.tagline}
          </p>

          {/* Pricing display */}
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-3xl font-extrabold font-heading text-navy dark:text-white">
              {formatCurrency(plan.price)}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              / {plan.period}
            </span>
          </div>

          {/* Current plan progress if applicable */}
          {isCurrent && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-emerald-800 dark:text-emerald-300">Remaining Balance</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">{mealsLeft} Meals</span>
              </div>
              <div className="w-full h-2 rounded-full bg-emerald-100 dark:bg-emerald-900 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min(100, (mealsLeft / plan.mealCount) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Features list */}
          <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 mb-6">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-soft/80 dark:bg-orange/20 text-orange flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button
          variant={plan.isPopular ? 'primary' : 'outline'}
          size="md"
          className="w-full"
          onClick={handleStartPurchase}
        >
          {isCurrent ? 'Renew / Top-up Plan' : 'Subscribe Now'}
        </Button>
      </Card>

      {/* Multi-step Checkout Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={step === 2 ? 'Payment Receipt' : `Subscribe to ${plan.name}`}
        maxWidth="max-w-md"
      >
        <div className="space-y-6">
          <Stepper
            steps={['Payment', 'Processing', 'Receipt']}
            currentStep={step}
          />

          {step === 0 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Plan:</span>
                  <span className="font-bold text-navy dark:text-white">{plan.name}</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Meals Added:</span>
                  <span className="font-bold text-orange">+{plan.mealCount} Meals</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-dark-border">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Total Payable:</span>
                  <span className="text-lg font-extrabold text-navy dark:text-white">{formatCurrency(plan.price)}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Select Mock Payment Gateway:
                </p>

                {[
                  { id: 'UPI', label: 'UPI (Google Pay / PhonePe / Paytm)', icon: Smartphone },
                  { id: 'Card', label: 'Debit / Credit Card', icon: CreditCard },
                  { id: 'Wallet', label: 'College Student Wallet', icon: Wallet }
                ].map((item) => (
                  <label
                    key={item.id}
                    onClick={() => setPaymentMethod(item.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === item.id
                        ? 'border-orange bg-orange-soft/30 dark:bg-orange/10 ring-2 ring-orange/30'
                        : 'border-slate-200 dark:border-dark-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-orange" />
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.label}</span>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === item.id}
                      onChange={() => setPaymentMethod(item.id)}
                      className="text-orange focus:ring-orange"
                    />
                  </label>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-success" />
                <span>256-bit Mock Encrypted Payment Gateway</span>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button variant="ghost" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleExecutePayment}>
                  Pay {formatCurrency(plan.price)}
                </Button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 border-4 border-orange border-t-transparent rounded-full animate-spin" />
              <h4 className="text-base font-bold font-heading text-navy dark:text-white">
                Contacting Bank Gateway...
              </h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Simulating UPI authorization and crediting meals to your hostel dining ledger.
              </p>
            </div>
          )}

          {step === 2 && receiptData && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-2 shadow-md">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-lg font-bold font-heading text-emerald-900 dark:text-emerald-200">
                  Payment Successful!
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Transaction Ref: {receiptData.transactionId}
                </p>
              </div>

              <div className="space-y-2 text-xs bg-slate-50 dark:bg-dark-bg p-4 rounded-xl border border-slate-200 dark:border-dark-border">
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-dark-border">
                  <span className="text-slate-500">Plan Subscribed:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{plan.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-dark-border">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(receiptData.amountPaid)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-dark-border">
                  <span className="text-slate-500">Payment Mode:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{receiptData.paymentMethod}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">New Meals Balance:</span>
                  <span className="font-bold text-orange">{receiptData.user?.mealsLeft} Meals</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setModalOpen(false)}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
