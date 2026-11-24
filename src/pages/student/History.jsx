import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as mockApi from '../../services/mockApi';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import RatingStars from '../../components/features/RatingStars';
import { formatDate } from '../../utils/formatDate';
import { Download, Search, Star, Clock, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [mealTypeFilter, setMealTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Rate Modal state
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  const loadHistory = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await mockApi.getHistory(user.id, {
        mealType: mealTypeFilter,
        status: statusFilter,
        search
      });
      setHistory(data);
    } catch (err) {
      console.error('History load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user, mealTypeFilter, statusFilter, search]);

  const handleOpenRate = (item) => {
    setSelectedRecord(item);
    setRating(item.rating || 5);
    setReview(item.review || '');
    setRateModalOpen(true);
  };

  const handleSaveRating = async () => {
    if (!selectedRecord) return;
    try {
      await mockApi.rateMeal(selectedRecord.id, rating, review);
      toast.success('Thank you for rating your meal!');
      setRateModalOpen(false);
      loadHistory();
    } catch {
      toast.error('Failed to save rating');
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (history.length === 0) {
      toast.error('No records to export');
      return;
    }

    const headers = ['Date', 'Meal Type', 'Menu Name', 'Time Slot', 'Status', 'Served At', 'Counter', 'Rating'];
    const rows = history.map(h => [
      h.date,
      h.mealType,
      `"${h.menuName}"`,
      h.slot,
      h.status,
      h.servedAt || 'N/A',
      h.counter || 'N/A',
      h.rating || 'Unrated'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ABES-Meal-History-${user?.rollNo || 'student'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('History exported as CSV!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-navy dark:text-white">
            Meal History & Logs
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Complete audit trail of all booked, served, skipped, and expired dining passes.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={Download}
          onClick={handleExportCSV}
        >
          Export CSV
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by dish name or date..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-orange/30"
            />
          </div>

          <div>
            <select
              value={mealTypeFilter}
              onChange={(e) => setMealTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-orange/30"
            >
              <option value="all">All Meal Types</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Snacks">Snacks</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-orange/30"
            >
              <option value="all">All Statuses</option>
              <option value="Served">Served</option>
              <option value="Skipped">Skipped</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>
      </Card>

      {/* History Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-dark-border bg-slate-50 dark:bg-dark-bg/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="p-4">Date</th>
                <th className="p-4">Meal Type</th>
                <th className="p-4">Dish</th>
                <th className="p-4">Slot</th>
                <th className="p-4">Status</th>
                <th className="p-4">Redemption</th>
                <th className="p-4 text-right">Rating & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-border text-xs">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    Loading records...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    No history records found.
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-dark-border/40 transition-colors">
                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {formatDate(item.date)}
                    </td>
                    <td className="p-4 font-bold text-navy dark:text-white">
                      {item.mealType}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {item.menuName}
                    </td>
                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {item.slot}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          item.status === 'Served'
                            ? 'success'
                            : item.status === 'Skipped'
                            ? 'warning'
                            : 'danger'
                        }
                        size="sm"
                        dot
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {item.servedAt ? (
                        <div>
                          <p className="font-medium text-slate-700 dark:text-slate-200">
                            {formatDate(item.servedAt, 'time')}
                          </p>
                          <p className="text-[10px] text-slate-400">{item.counter}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      {item.status === 'Served' ? (
                        item.rating ? (
                          <div className="flex items-center justify-end gap-1">
                            <RatingStars rating={item.rating} size="sm" />
                            <span className="font-bold text-slate-700 dark:text-slate-300">{item.rating}</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenRate(item)}
                            className="text-xs font-semibold text-orange hover:underline"
                          >
                            Rate Meal
                          </button>
                        )
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Rate Meal Modal */}
      <Modal
        isOpen={rateModalOpen}
        onClose={() => setRateModalOpen(false)}
        title="Rate Your Meal"
        subtitle={selectedRecord ? `${selectedRecord.mealType}: ${selectedRecord.menuName}` : ''}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-dark-bg rounded-2xl">
            <p className="text-xs text-slate-500 mb-2">Tap stars to rate:</p>
            <RatingStars
              interactive
              size="lg"
              rating={rating}
              onChange={setRating}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Comments / Feedback (Optional)
            </label>
            <textarea
              rows="3"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="How was the taste, portion size, and hygiene?"
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs focus:outline-none focus:ring-2 focus:ring-orange/30"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setRateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveRating}>
              Submit Review
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
