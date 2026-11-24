import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as mockApi from '../../services/mockApi';
import PlanCard from '../../components/features/PlanCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatDate, formatCurrency } from '../../utils/formatDate';
import { Download, CreditCard, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentPlans() {
  const { user, refreshUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock transactions history
  const [transactions, setTransactions] = useState([
    {
      id: 'TXN-984321',
      date: '2026-11-15',
      planName: 'Monthly Standard (90 Meals)',
      amount: 3000,
      method: 'UPI (GPay)',
      status: 'Success'
    },
    {
      id: 'TXN-871244',
      date: '2026-10-15',
      planName: 'Monthly Standard (90 Meals)',
      amount: 3000,
      method: 'College Wallet',
      status: 'Success'
    }
  ]);

  useEffect(() => {
    async function loadPlans() {
      try {
        const data = await mockApi.getPlans();
        setPlans(data);
      } catch (err) {
        console.error('Failed to load plans:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  const handleBuyPlan = async (planId, paymentDetails) => {
    if (!user) return;
    const res = await mockApi.buySubscription(user.id, planId, paymentDetails);
    await refreshUser();

    // Add transaction locally
    setTransactions(prev => [
      {
        id: res.transactionId,
        date: new Date().toISOString().split('T')[0],
        planName: res.plan.name,
        amount: res.amountPaid,
        method: paymentDetails.method,
        status: 'Success'
      },
      ...prev
    ]);

    return res;
  };

  const handleDownloadInvoice = (txn) => {
    const text = `=====================================\nABES ENGINEERING COLLEGE, GHAZIABAD\nMESS DINING FEE RECEIPT\n=====================================\nTransaction ID: ${txn.id}\nDate: ${txn.date}\nStudent Name: ${user?.name}\nRoll Number: ${user?.rollNo}\nPlan: ${txn.planName}\nAmount Paid: Rs. ${txn.amount}\nPayment Mode: ${txn.method}\nStatus: ${txn.status}\n=====================================\nThank you for dining at ABES Hostel Mess.`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt-${txn.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Receipt downloaded!');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-navy dark:text-white">
          Meal Plans & Wallet
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Flexible hostel meal packages with roll-over credits and mock instant UPI checkout.
        </p>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrent={user?.currentPlanId === plan.id}
            mealsLeft={user?.mealsLeft || 0}
            onBuy={handleBuyPlan}
          />
        ))}
      </div>

      {/* Transactions & Invoices Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold font-heading text-navy dark:text-white">
              Billing History & Receipts
            </h3>
            <p className="text-xs text-slate-500">
              Download receipts for hostel mess fee reimbursement
            </p>
          </div>
          <Badge variant="navy" size="sm">Verified Payments</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-dark-border text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="pb-3">Date</th>
                <th className="pb-3">Transaction ID</th>
                <th className="pb-3">Subscription</th>
                <th className="pb-3">Method</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
              {transactions.map(txn => (
                <tr key={txn.id} className="hover:bg-slate-50 dark:hover:bg-dark-border/40">
                  <td className="py-3 font-medium text-slate-700 dark:text-slate-300">
                    {formatDate(txn.date)}
                  </td>
                  <td className="py-3 font-mono text-slate-500">
                    {txn.id}
                  </td>
                  <td className="py-3 font-semibold text-navy dark:text-white">
                    {txn.planName}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">
                    {txn.method}
                  </td>
                  <td className="py-3 font-bold text-slate-800 dark:text-slate-200">
                    {formatCurrency(txn.amount)}
                  </td>
                  <td className="py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Download}
                      onClick={() => handleDownloadInvoice(txn)}
                    >
                      Receipt
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
