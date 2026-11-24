import React, { useState, useEffect } from 'react';
import * as mockApi from '../../services/mockApi';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import RatingStars from '../../components/features/RatingStars';
import { initialStats } from '../../data/stats';
import { formatDate } from '../../utils/formatDate';
import { MessageSquare, Check, Reply, Star, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManagerFeedbackReview() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reply modal
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [newStatus, setNewStatus] = useState('Resolved');

  const { dishRatings } = initialStats;

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getFeedback();
      setFeedbacks(data);
    } catch (err) {
      console.error('Failed to load feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenReply = (ticket) => {
    setActiveTicket(ticket);
    setReplyText(ticket.managerReply || '');
    setNewStatus(ticket.status === 'Open' ? 'Resolved' : ticket.status);
    setReplyModalOpen(true);
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !activeTicket) return;
    try {
      await mockApi.replyComplaint(activeTicket.id, replyText, newStatus);
      toast.success(`Reply sent on ${activeTicket.ticketNumber || 'ticket'}!`);
      setReplyModalOpen(false);
      loadData();
    } catch {
      toast.error('Failed to update ticket');
    }
  };

  const reviews = feedbacks.filter(f => f.type === 'review');
  const complaints = feedbacks.filter(f => f.type === 'complaint');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-navy dark:text-white">
          Student Feedback & Complaint Tickets
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review dish taste ratings and respond directly to student complaints.
        </p>
      </div>

      {/* Dish Ratings Ranking */}
      <Card className="p-6">
        <h3 className="text-base font-bold font-heading text-navy dark:text-white mb-1">
          Highest Rated Mess Dishes
        </h3>
        <p className="text-xs text-slate-500 mb-4">Student ratings aggregate from meal reviews</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {dishRatings.map(d => (
            <div key={d.dish} className="p-3.5 rounded-xl border border-slate-100 dark:border-dark-border bg-slate-50/50 dark:bg-dark-bg/40 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{d.dish}</p>
                <p className="text-[10px] text-slate-400">{d.count} ratings</p>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 px-2 py-0.5 rounded-lg text-amber-700 dark:text-amber-400 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {d.rating}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Complaints Resolution Table */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-heading text-navy dark:text-white">
              Official Student Complaint Tickets ({complaints.length})
            </h3>
            <p className="text-xs text-slate-500">
              Address student issues regarding food taste, cleanliness, or counter speed
            </p>
          </div>
          <Badge variant="warning" size="sm">
            {complaints.filter(c => c.status !== 'Resolved').length} Unresolved
          </Badge>
        </div>

        <div className="space-y-3">
          {complaints.map(t => (
            <div
              key={t.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-orange">{t.ticketNumber}</span>
                  <Badge variant="default" size="sm">{t.category}</Badge>
                  <span className="text-slate-400 font-medium">• By {t.studentName} ({t.rollNo})</span>
                </div>
                <Badge
                  variant={t.status === 'Resolved' ? 'success' : t.status === 'In Progress' ? 'warning' : 'danger'}
                  size="sm"
                  dot
                >
                  {t.status}
                </Badge>
              </div>

              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {t.subject}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                {t.description}
              </p>

              {t.managerReply ? (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-[11px] text-emerald-800 dark:text-emerald-300">
                  <strong>Manager Response:</strong> {t.managerReply}
                </div>
              ) : null}

              <div className="flex justify-end pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Reply}
                  onClick={() => handleOpenReply(t)}
                >
                  {t.managerReply ? 'Update Response' : 'Reply & Resolve'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Reply Modal */}
      <Modal
        isOpen={replyModalOpen}
        onClose={() => setReplyModalOpen(false)}
        title={`Respond to Ticket ${activeTicket?.ticketNumber}`}
        subtitle={activeTicket?.subject}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Ticket Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs"
            >
              <option value="Resolved">Mark as Resolved</option>
              <option value="In Progress">In Progress (Under Action)</option>
              <option value="Open">Keep Open</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Manager Action & Response
            </label>
            <textarea
              rows="4"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="e.g. Instructed kitchen team; corrected seasoning..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setReplyModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSendReply}>
              Save & Send Notification
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
