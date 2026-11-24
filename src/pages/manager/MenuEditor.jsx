import React, { useState, useEffect } from 'react';
import * as mockApi from '../../services/mockApi';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import Modal from '../../components/ui/Modal';
import { Plus, Edit2, Trash2, Copy, Clock, Flame, Utensils } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManagerMenuEditor() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [activeDay, setActiveDay] = useState('Monday');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit/Add modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [formData, setFormData] = useState({
    mealType: 'Lunch',
    name: '',
    itemsString: '',
    isVeg: true,
    calories: 750,
    timing: '12:30 - 14:30',
    cutoffTime: '11:00'
  });

  const loadMenu = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getMenu(activeDay);
      setMenuItems(data);
    } catch (err) {
      console.error('Menu load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, [activeDay]);

  const handleOpenAdd = () => {
    setEditingDish(null);
    setFormData({
      mealType: 'Lunch',
      name: '',
      itemsString: 'Dal Makhani, Shahi Paneer, Jeera Rice, Tandoori Roti (3 pcs), Salad',
      isVeg: true,
      calories: 750,
      timing: '12:30 - 14:30',
      cutoffTime: '11:00'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (dish) => {
    setEditingDish(dish);
    setFormData({
      mealType: dish.mealType,
      name: dish.name,
      itemsString: dish.items.join(', '),
      isVeg: dish.isVeg,
      calories: dish.calories,
      timing: dish.timing,
      cutoffTime: dish.cutoffTime
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Dish name is required');
      return;
    }

    const payload = {
      day: activeDay,
      mealType: formData.mealType,
      name: formData.name,
      items: formData.itemsString.split(',').map(s => s.trim()).filter(Boolean),
      isVeg: formData.isVeg,
      calories: parseInt(formData.calories, 10) || 600,
      timing: formData.timing,
      cutoffTime: formData.cutoffTime
    };

    try {
      if (editingDish) {
        await mockApi.updateDish(editingDish.id, payload);
        toast.success(`Updated ${formData.name}`);
      } else {
        await mockApi.addDish(payload);
        toast.success(`Added ${formData.name} to ${activeDay}`);
      }
      setModalOpen(false);
      loadMenu();
    } catch {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (dishId, dishName) => {
    if (!window.confirm(`Delete "${dishName}" from ${activeDay} menu?`)) return;
    try {
      await mockApi.deleteDish(dishId);
      toast.success('Dish removed from menu');
      loadMenu();
    } catch {
      toast.error('Failed to delete dish');
    }
  };

  const handleCopyLastWeek = () => {
    toast.success('Current weekly menu replicated from previous schedule!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-navy dark:text-white">
            Weekly Menu Editor
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Publish meal thalis, calories, and cut-off deadlines. Changes reflect live for all students.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={Copy} onClick={handleCopyLastWeek}>
            Copy Last Week
          </Button>
          <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAdd}>
            Add Dish / Meal
          </Button>
        </div>
      </div>

      {/* Day Tabs */}
      <Tabs
        pill
        tabs={days.map(d => ({ id: d, label: d }))}
        activeTab={activeDay}
        onChange={setActiveDay}
      />

      {/* Dishes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuItems.map((dish) => (
          <Card key={dish.id} className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant={dish.isVeg ? 'veg' : 'nonveg'} size="sm">
                    {dish.isVeg ? 'Pure Veg' : 'Non-Veg'}
                  </Badge>
                  <span className="font-bold text-xs uppercase tracking-wider text-orange">
                    {dish.mealType}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(dish)}
                    className="p-1.5 text-slate-400 hover:text-navy dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-border rounded-lg"
                    title="Edit Dish"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(dish.id, dish.name)}
                    className="p-1.5 text-slate-400 hover:text-danger hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
                    title="Delete Dish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-heading font-bold text-base text-navy dark:text-white">
                {dish.name}
              </h3>

              <div className="flex items-center gap-3 my-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-orange" />
                  {dish.timing}
                </span>
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  {dish.calories} kcal
                </span>
                <span>Cut-off: <strong>{dish.cutoffTime}</strong></span>
              </div>

              <div className="bg-slate-50 dark:bg-dark-bg/60 p-3 rounded-xl border border-slate-100 dark:border-dark-border mt-3">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Thali Items:
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {dish.items.join(', ')}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit / Add Dish Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDish ? `Edit ${editingDish.name}` : `Add New Meal for ${activeDay}`}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Meal Type
              </label>
              <select
                value={formData.mealType}
                onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Snacks">Snacks</option>
                <option value="Dinner">Dinner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Dietary Type
              </label>
              <select
                value={formData.isVeg ? 'veg' : 'nonveg'}
                onChange={(e) => setFormData({ ...formData, isVeg: e.target.value === 'veg' })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs"
              >
                <option value="veg">Pure Veg</option>
                <option value="nonveg">Non-Veg</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Thali Title *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Special Hyderabadi Dum Veg Biryani"
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Items (comma separated)
            </label>
            <textarea
              rows="2"
              value={formData.itemsString}
              onChange={(e) => setFormData({ ...formData, itemsString: e.target.value })}
              placeholder="e.g. Veg Biryani, Mirchi Ka Salan, Burani Raita, Gulab Jamun"
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Calories (kcal)
              </label>
              <input
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Meal Timing
              </label>
              <input
                type="text"
                value={formData.timing}
                onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Cut-off Time
              </label>
              <input
                type="text"
                value={formData.cutoffTime}
                onChange={(e) => setFormData({ ...formData, cutoffTime: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-dark-border">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Menu Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
