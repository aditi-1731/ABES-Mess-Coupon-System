import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as mockApi from '../../services/mockApi';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import RatingStars from '../../components/features/RatingStars';
import { formatDate } from '../../utils/formatDate';
import { MessageSquare, AlertCircle, CheckCircle2, Send, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentFeedback() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('review'); // 'review' | 'complaint'
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review state
  const [mealType, setMealType] = useState('Lunch');
  const [menuName, setMenuName] = useState('Dal Makhani & Jeera Rice');
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState(['Tasty', 'Great portion']);
  const [reviewComment, setReviewComment] = useState('');

  // Complaint state
  const [complaintCategory, setComplaintCategory] = useState('Food Quality');
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTags = ['Tasty', 'Hot & Fresh', 'Great portion', 'Hygiene', 'Less Oil', 'Could be better', 'Cold food'];

  const loadFeedbacks = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await mockApi.getFeedback({ userId: user.id });
      setFeedbacks(data);
    } catch (err) {
      console.error('Feedback fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, [user]);

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await mockApi.submitFeedback({
        userId: user.id,
        studentName: user.name,
        rollNo: user.rollNo,
        type: 'review',
        mealType,
        menuName,
        rating,
        tags: selectedTags,
        comment: reviewComment
      });
      toast.success('Meal review submitted! Thank you.');
      setReviewComment('');
      loadFeedbacks();
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    if (!complaintSubject.trim() || !complaintDesc.trim()) {
      toast.error('Please enter both subject and description.');
      return;
    }

    setIsSubmitting(true);
    try {
      const ticket = await mockApi.submitFeedback({
        userId: user.id,
        studentName: user.name,
        rollNo: user.rollNo,
        type: 'complaint',
        category: complaintCategory,
        subject: complaintSubject,
        description: complaintDesc,
        priority: 'Medium'
      });
      toast.success(`Complaint ticket ${ticket.ticketNumber} lodged!`);
      setComplaintSubject('');
      setComplaintDesc('');
      loadFeedbacks();
    } catch {
      toast.error('Failed to lodge complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  const myTickets = feedbacks.filter(f => f.type === 'complaint');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-navy dark:text-white">
          Feedback & Complaints Desk
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Rate your meals to improve quality or raise actionable tickets with mess management.
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        pill
        tabs={[
          { id: 'review', label: 'Rate Meal & Experience', icon: MessageSquare },
          { id: 'complaint', label: 'Raise Complaint Ticket', icon: AlertCircle, count: myTickets.length }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form */}
        <div className="lg:col-span-7">
          {activeTab === 'review' ? (
            <Card className="p-6">
              <h3 className="text-base font-bold font-heading text-navy dark:text-white mb-4">
                Rate Recent Meal
              </h3>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Meal Type
                    </label>
                    <select
                      value={mealType}
                      onChange={(e) => setMealType(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs focus:ring-2 focus:ring-orange/30"
                    >
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Snacks">Snacks</option>
                      <option value="Dinner">Dinner</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Dish Name
                    </label>
                    <input
                      type="text"
                      value={menuName}
                      onChange={(e) => setMenuName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs focus:ring-2 focus:ring-orange/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                    Your Rating
                  </label>
                  <RatingStars
                    interactive
                    size="lg"
                    rating={rating}
                    onChange={setRating}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                    Select Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-orange text-white border-orange shadow-sm'
                            : 'border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-bg text-slate-600 dark:text-slate-300 hover:border-orange'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Your Review
                  </label>
                  <textarea
                    rows="3"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share honest feedback about the taste, seasoning, or counter service..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs focus:ring-2 focus:ring-orange/30"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  loading={isSubmitting}
                  icon={Send}
                  iconPosition="right"
                >
                  Submit Feedback
                </Button>
              </form>
            </Card>
          ) : (
            <Card className="p-6">
              <h3 className="text-base font-bold font-heading text-navy dark:text-white mb-4">
                Raise an Official Ticket
              </h3>

              <form onSubmit={handleSubmitComplaint} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={complaintCategory}
                    onChange={(e) => setComplaintCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs focus:ring-2 focus:ring-orange/30"
                  >
                    <option value="Food Quality">Food Quality & Taste</option>
                    <option value="Hygiene & Cleanliness">Hygiene & Cleanliness</option>
                    <option value="Counter Delay">Counter Delay / QR Scanning</option>
                    <option value="Mess Facility & Seating">Mess Facility & Seating</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={complaintSubject}
                    onChange={(e) => setComplaintSubject(e.target.value)}
                    placeholder="Brief summary of the issue"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs focus:ring-2 focus:ring-orange/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Detailed Description *
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={complaintDesc}
                    onChange={(e) => setComplaintDesc(e.target.value)}
                    placeholder="Describe what occurred, date/time, and specific counter if applicable..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs focus:ring-2 focus:ring-orange/30"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  loading={isSubmitting}
                  icon={Send}
                  iconPosition="right"
                >
                  Lodge Complaint
                </Button>
              </form>
            </Card>
          )}
        </div>

        {/* Right: History of submitted tickets */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6">
            <h3 className="text-base font-bold font-heading text-navy dark:text-white mb-3">
              Your Lodged Complaints ({myTickets.length})
            </h3>

            {myTickets.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No complaint tickets raised yet.
              </p>
            ) : (
              <div className="space-y-3">
                {myTickets.map(ticket => (
                  <div
                    key={ticket.id}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-dark-border bg-slate-50/60 dark:bg-dark-bg/40 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-orange text-[11px]">
                        {ticket.ticketNumber}
                      </span>
                      <Badge
                        variant={
                          ticket.status === 'Resolved'
                            ? 'success'
                            : ticket.status === 'In Progress'
                            ? 'warning'
                            : 'danger'
                        }
                        size="sm"
                        dot
                      >
                        {ticket.status}
                      </Badge>
                    </div>

                    <h4 className="font-bold text-slate-800 dark:text-slate-100">
                      {ticket.subject}
                    </h4>
                    <p className="text-slate-500 text-[11px]">
                      {ticket.description}
                    </p>

                    {ticket.managerReply && (
                      <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-[11px] text-emerald-800 dark:text-emerald-300">
                        <strong>Manager Reply:</strong> {ticket.managerReply}
                      </div>
                    )}
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
