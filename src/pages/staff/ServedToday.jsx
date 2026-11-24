import React, { useState, useEffect } from 'react';
import * as mockApi from '../../services/mockApi';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatDate, getTodayDateString } from '../../utils/formatDate';
import { Download, Search, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StaffServedToday() {
  const [servedList, setServedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [mealFilter, setMealFilter] = useState('all');

  const today = getTodayDateString();

  const loadData = async () => {
    setLoading(true);
    try {
      const allHistory = await mockApi.getHistory();
      // Filter for today's served students
      const todayServed = allHistory.filter(h => h.date === today && h.status === 'Served');
      setServedList(todayServed);
    } catch (err) {
      console.error('Failed to load served list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = servedList.filter(item => {
    if (mealFilter !== 'all' && item.mealType.toLowerCase() !== mealFilter.toLowerCase()) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        item.studentName.toLowerCase().includes(q) ||
        item.menuName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      toast.error('No records to export');
      return;
    }

    const headers = ['Student Name', 'Meal Type', 'Menu', 'Time Slot', 'Served At', 'Counter'];
    const rows = filtered.map(item => [
      `"${item.studentName}"`,
      item.mealType,
      `"${item.menuName}"`,
      item.slot,
      item.servedAt,
      item.counter
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `ABES-Served-Today-${today}.csv`;
    link.click();
    toast.success('Daily served logs exported!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-navy dark:text-white">
            Students Served Today
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time counter log for {formatDate(today)}. Total verified: {servedList.length} students.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={Download}
          onClick={handleExportCSV}
        >
          Export Counter Log
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by student name or dish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg focus:ring-2 focus:ring-orange/30"
            />
          </div>

          <div>
            <select
              value={mealFilter}
              onChange={(e) => setMealFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg focus:ring-2 focus:ring-orange/30"
            >
              <option value="all">All Meals (Today)</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Snacks">Snacks</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Served Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-dark-border bg-slate-50 dark:bg-dark-bg/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="p-4">Time</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Meal Type</th>
                <th className="p-4">Thali Menu</th>
                <th className="p-4">Booked Slot</th>
                <th className="p-4">Verification Counter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    Loading records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    No students served matching filters today.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-dark-border/40">
                    <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(item.servedAt, 'time')}
                    </td>
                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                      {item.studentName}
                    </td>
                    <td className="p-4 font-bold text-navy dark:text-white">
                      {item.mealType}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      {item.menuName}
                    </td>
                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {item.slot}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <Badge variant="navy" size="sm">
                        {item.counter || 'Counter 1'}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
