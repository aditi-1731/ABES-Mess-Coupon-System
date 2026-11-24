import React, { useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import RatingStars from './RatingStars';
import Modal from '../ui/Modal';
import { Clock, Flame, Check, AlertCircle, Ban } from 'lucide-react';
import { TIME_SLOTS } from '../../utils/constants';
import { fireConfetti } from './Confetti';
import { useNavigate } from 'react-router-dom';

export default function MealCard({
  meal,
  booking,
  onBook,
  onSkip,
  onCancel,
  studentMealsLeft = 0
}) {
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const isBooked = booking && booking.status !== 'Cancelled' && booking.status !== 'Skipped';
  const isSkipped = booking?.status === 'Skipped';
  const isServed = booking?.status === 'Used';

  const slots = TIME_SLOTS[meal.mealType] || ['12:30 - 13:00', '13:00 - 13:30', '13:30 - 14:00'];

  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;
    setIsSubmitting(true);
    try {
      await onBook({
        mealType: meal.mealType,
        menuId: meal.id,
        menuName: meal.name,
        slot: selectedSlot
      });
      setSlotModalOpen(false);
      fireConfetti();
    } catch {
      // error handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card hoverLift className="overflow-hidden flex flex-col justify-between">
        <div>
          {/* Card Top Pill Bar */}
          <div className="p-5 pb-3 border-b border-slate-100 dark:border-dark-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                  meal.isVeg ? 'border-green-600' : 'border-red-600'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${meal.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
              </span>
              <h3 className="font-heading font-bold text-base text-navy dark:text-white">
                {meal.mealType}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {isServed ? (
                <Badge variant="default" size="sm" dot>Served</Badge>
              ) : isSkipped ? (
                <Badge variant="warning" size="sm" dot>Skipped</Badge>
              ) : isBooked ? (
                <Badge variant="success" size="sm" dot>Booked</Badge>
              ) : (
                <Badge variant="primary" size="sm">Available</Badge>
              )}
            </div>
          </div>

          {/* Dish details */}
          <div className="p-5 space-y-3">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {meal.name}
              </h4>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-orange" />
                  {meal.timing}
                </span>
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  {meal.calories} kcal
                </span>
              </div>
            </div>

            {/* Menu Items List */}
            <div className="bg-slate-50 dark:bg-dark-bg/60 p-3 rounded-xl border border-slate-100 dark:border-dark-border/60">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Included in this thali:
              </p>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                {meal.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange/60" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Rating and cutoff notice */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <RatingStars rating={meal.rating} size="sm" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {meal.rating}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Cut-off: <strong className="text-slate-600 dark:text-slate-300">{meal.cutoffTime}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-5 pt-3 border-t border-slate-100 dark:border-dark-border bg-slate-50/50 dark:bg-dark-bg/30">
          {isServed ? (
            <div className="text-center py-1">
              <p className="text-xs font-semibold text-slate-500 flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4 text-success" />
                Redeemed at Counter
              </p>
            </div>
          ) : isSkipped ? (
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-600 dark:text-amber-400 font-medium">Meal marked skipped</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedSlot(slots[0]);
                  setSlotModalOpen(true);
                }}
              >
                Re-book
              </Button>
            </div>
          ) : isBooked ? (
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={() => navigate('/student/coupon')}
              >
                View QR Coupon
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSkip(booking.id)}
                title="Skip this meal to save food waste"
                className="text-slate-500 hover:text-amber-600"
              >
                Skip
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                disabled={studentMealsLeft <= 0}
                onClick={() => {
                  setSelectedSlot(slots[0]);
                  setSlotModalOpen(true);
                }}
              >
                {studentMealsLeft <= 0 ? 'No Meals Left (Buy Plan)' : 'Book Meal Slot'}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Select Time Slot Modal */}
      <Modal
        isOpen={slotModalOpen}
        onClose={() => setSlotModalOpen(false)}
        title={`Select Time Slot for ${meal.mealType}`}
        subtitle="Choose a dining window to avoid peak counter rush"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Booking a slot guarantees fast counter service and prevents kitchen food waste.
          </p>

          {/* Slots List with Simulated Capacity */}
          <div className="space-y-2.5">
            {slots.map((slot, idx) => {
              const capacity = idx === 1 ? 88 : idx === 2 ? 65 : 35; // simulated rush %
              const isSelected = selectedSlot === slot;

              return (
                <div
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-orange bg-orange-soft/30 dark:bg-orange/15 shadow-sm ring-2 ring-orange/30'
                      : 'border-slate-200 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-dark-card'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-slate-800 dark:text-white">
                      {slot}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        capacity > 80
                          ? 'text-danger'
                          : capacity > 50
                          ? 'text-amber-500'
                          : 'text-success'
                      }`}
                    >
                      {capacity}% Booked
                    </span>
                  </div>

                  {/* Capacity Bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        capacity > 80 ? 'bg-danger' : capacity > 50 ? 'bg-amber-500' : 'bg-success'
                      }`}
                      style={{ width: `${capacity}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-dark-border">
            <Button variant="ghost" onClick={() => setSlotModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={isSubmitting}
              disabled={!selectedSlot}
              onClick={handleConfirmBooking}
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
