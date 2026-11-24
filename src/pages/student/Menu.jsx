import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import * as mockApi from '../../services/mockApi';
import MealCard from '../../components/features/MealCard';
import Tabs from '../../components/ui/Tabs';
import Skeleton from '../../components/ui/Skeleton';
import { getDayOfWeek, getTodayDateString } from '../../utils/formatDate';
import { Utensils, Filter } from 'lucide-react';

export default function StudentMenu() {
  const { user } = useAuth();
  const { activeBookings, bookMeal, skipMeal, cancelBooking } = useData();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayDay = getDayOfWeek();
  const [activeDay, setActiveDay] = useState(todayDay);
  const [vegOnly, setVegOnly] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('all');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = getTodayDateString();

  useEffect(() => {
    async function loadMenu() {
      setLoading(true);
      try {
        const data = await mockApi.getMenu(activeDay);
        setMenuItems(data);
      } catch (err) {
        console.error('Failed to load menu:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, [activeDay]);

  const filteredItems = menuItems.filter(item => {
    if (vegOnly && !item.isVeg) return false;
    if (selectedMealType !== 'all' && item.mealType.toLowerCase() !== selectedMealType.toLowerCase()) return false;
    return true;
  });

  const dayTabs = days.map(d => ({
    id: d,
    label: d === todayDay ? `${d} (Today)` : d
  }));

  return (
    <div className="space-y-6">
      {/* Page Title & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-navy dark:text-white">
            Weekly Mess Menu & Booking
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pick your time slots, review nutritional facts, and manage your dining.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border px-3 py-2 rounded-xl">
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={(e) => setVegOnly(e.target.checked)}
              className="rounded text-green-600 focus:ring-green-500"
            />
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-600" />
              Veg Only
            </span>
          </label>

          <select
            value={selectedMealType}
            onChange={(e) => setSelectedMealType(e.target.value)}
            className="text-xs font-semibold bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-orange/30"
          >
            <option value="all">All Meals</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="snacks">Snacks</option>
            <option value="dinner">Dinner</option>
          </select>
        </div>
      </div>

      {/* Day Selector Tabs (Mon-Sun) */}
      <Tabs
        pill
        tabs={dayTabs}
        activeTab={activeDay}
        onChange={setActiveDay}
      />

      {/* Meals Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="p-6 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border space-y-4">
              <Skeleton height="h-6" width="w-1/2" />
              <Skeleton height="h-4" width="w-3/4" />
              <Skeleton height="h-24" />
              <Skeleton height="h-10" />
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          No meals match your filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map(meal => {
            // Find existing booking for this meal
            const existingBooking = activeBookings.find(
              b => b.mealType === meal.mealType && (activeDay === todayDay ? b.date === today : true)
            );

            return (
              <MealCard
                key={meal.id}
                meal={meal}
                booking={existingBooking}
                onBook={bookMeal}
                onSkip={skipMeal}
                onCancel={cancelBooking}
                studentMealsLeft={user?.mealsLeft || 0}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
