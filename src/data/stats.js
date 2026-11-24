export const initialStats = {
  kpis: {
    totalStudents: 1420,
    mealsServedToday: 894,
    activePlans: 1210,
    revenueThisMonth: 345000,
    wastageReductionPercent: 32,
    minutesSavedPerStudent: 14.5
  },
  
  // Weekly meal distribution (served per day)
  weeklyServed: [
    { day: 'Mon', served: 1140, booked: 1220, skipped: 80 },
    { day: 'Tue', served: 1180, booked: 1250, skipped: 70 },
    { day: 'Wed', served: 1220, booked: 1290, skipped: 70 },
    { day: 'Thu', served: 1160, booked: 1230, skipped: 70 },
    { day: 'Fri', served: 1290, booked: 1350, skipped: 60 },
    { day: 'Sat', served: 980, booked: 1040, skipped: 60 },
    { day: 'Sun', served: 920, booked: 970, skipped: 50 },
  ],

  // Peak hours distribution (hourly scans)
  peakHours: [
    { time: '07:30', count: 85, label: 'Early BF' },
    { time: '08:00', count: 210, label: 'Peak BF' },
    { time: '08:30', count: 245, label: 'Rush BF' },
    { time: '09:00', count: 110, label: 'Late BF' },
    { time: '12:30', count: 290, label: 'Early Lunch' },
    { time: '13:00', count: 480, label: 'Peak Lunch' },
    { time: '13:30', count: 420, label: 'Rush Lunch' },
    { time: '14:00', count: 180, label: 'Late Lunch' },
    { time: '17:00', count: 190, label: 'Snacks' },
    { time: '19:30', count: 260, label: 'Early Dinner' },
    { time: '20:00', count: 460, label: 'Peak Dinner' },
    { time: '20:30', count: 390, label: 'Rush Dinner' },
    { time: '21:00', count: 130, label: 'Late Dinner' },
  ],

  // Meal type breakdown
  mealTypeBreakdown: [
    { name: 'Lunch', value: 42, color: '#FF7A1A' },
    { name: 'Dinner', value: 36, color: '#1F3A5F' },
    { name: 'Breakfast', value: 16, color: '#16A34A' },
    { name: 'Snacks', value: 6, color: '#F59E0B' }
  ],

  // Wastage analytics: Booked vs Served vs Skipped vs Unused
  wastageTrends: [
    { week: 'Week 1', cooked: 9200, served: 8600, savedFromSkips: 600, wasteKg: 42 },
    { week: 'Week 2', cooked: 8900, served: 8500, savedFromSkips: 680, wasteKg: 35 },
    { week: 'Week 3', cooked: 8800, served: 8450, savedFromSkips: 720, wasteKg: 28 },
    { week: 'Week 4', cooked: 8700, served: 8420, savedFromSkips: 790, wasteKg: 19 },
  ],

  // Revenue by Plan
  revenueByPlan: [
    { name: 'Monthly Standard', revenue: 270000, students: 90, color: '#FF7A1A' },
    { name: 'Weekly Flexi', revenue: 48000, students: 60, color: '#1F3A5F' },
    { name: 'Pay-Per-Meal', revenue: 27000, students: 450, color: '#16A34A' }
  ],

  // Dish ratings
  dishRatings: [
    { dish: 'Amritsari Chole Bhature', rating: 4.9, count: 480 },
    { dish: 'Hyderabadi Veg Biryani', rating: 4.9, count: 520 },
    { dish: 'Dal Makhani & Jeera Rice', rating: 4.8, count: 610 },
    { dish: 'Paneer Butter Masala', rating: 4.8, count: 590 },
    { dish: 'Punjabi Aloo Paratha', rating: 4.8, count: 430 },
    { dish: 'Masala Dosa & Sambar', rating: 4.7, count: 410 },
    { dish: 'Puri Bhaji with Halwa', rating: 4.7, count: 390 },
  ]
};
