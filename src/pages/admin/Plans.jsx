import React, { useState, useEffect } from 'react';
import * as mockApi from '../../services/mockApi';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Plus, Edit2, Check, CreditCard, Star } from 'lucide-react';
import { formatCurrency } from '../../utils/formatDate';
import toast from 'react-hot-toast';

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit / Add modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    price: 3000,
    period: '30 Days',
    mealCount: 90,
    isPopular: false,
    featuresString: ''
  });

  const loadPlans = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getPlans();
      setPlans(data);
    } catch (err) {
      console.error('Failed to load plans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      tagline: plan.tagline,
      price: plan.price,
      period: plan.period,
      mealCount: plan.mealCount,
      isPopular: plan.isPopular,
      featuresString: plan.features.join('\n')
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updatedPlans = plans.map(p => {
      if (p.id === editingPlan.id) {
        return {
          ...p,
          ...formData,
          features: formData.featuresString.split('\n').filter(Boolean)
        };
      }
      return p;
    });

    localStorage.setItem('abes_plans', JSON.stringify(updatedPlans));
    setPlans(updatedPlans);
    setModalOpen(false);
    toast.success('Plan pricing updated successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-navy dark:text-white">
            Meal Plan Packages & Pricing
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure student subscription rates, meal allocations, and popular flags.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <Card key={plan.id} className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-heading font-bold text-lg text-navy dark:text-white">
                  {plan.name}
                </h3>
                {plan.isPopular && <Badge variant="primary" size="sm">Popular</Badge>}
              </div>
              <p className="text-xs text-slate-500 mb-4">{plan.tagline}</p>

              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-extrabold font-heading text-navy dark:text-white">
                  {formatCurrency(plan.price)}
                </span>
                <span className="text-xs text-slate-400">/ {plan.period}</span>
              </div>

              <div className="bg-slate-50 dark:bg-dark-bg p-3 rounded-xl border border-slate-100 dark:border-dark-border mb-4 text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Meals Included:</span>
                  <span className="font-bold text-orange">{plan.mealCount} Meals</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Effective per meal:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    ₹{Math.round(plan.price / plan.mealCount)} / thali
                  </span>
                </div>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-success" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6">
              <Button
                variant="outline"
                size="sm"
                icon={Edit2}
                className="w-full"
                onClick={() => handleOpenEdit(plan)}
              >
                Edit Plan & Pricing
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Plan Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Edit Plan: ${editingPlan?.name}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Plan Title
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Price (INR)
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value, 10) || 0 })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Meal Count
              </label>
              <input
                type="number"
                required
                value={formData.mealCount}
                onChange={(e) => setFormData({ ...formData, mealCount: parseInt(e.target.value, 10) || 1 })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Features (one per line)
            </label>
            <textarea
              rows="4"
              value={formData.featuresString}
              onChange={(e) => setFormData({ ...formData, featuresString: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-dark-border">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Plan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
